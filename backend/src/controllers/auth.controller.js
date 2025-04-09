import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validateUsername,
} from "../utils/validator.js";

import { Upload } from "@aws-sdk/lib-storage";
import dotenv from 'dotenv';
import { generateSignedUrl, s3Client } from "../utils/aws.config.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
dotenv.config();

export const signup = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    const fullNameError = validateFullName(fullName);
    const userNameError = validateUsername(userName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (fullNameError) {
      return res.status(400).json({ message: fullNameError });
    }

    if (userNameError) {
      return res.status(400).json({ message: userNameError });
    }

    if (emailError) {
      return res.status(400).json({ message: emailError });
    }

    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const existingUserByUsername = await User.findOne({ userName: userName });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("User successfully registered");

    generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      about: newUser.about,
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Fill all fields." });
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ message: "Invalid email." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if(user.profilePic){
      const signedUrl = await generateSignedUrl(user.profilePic);
      user.profilePic = signedUrl;
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      about: user.about,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    return req.status(500).json({ message: "Internal server error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("updating profile image");
    console.log("req.file : ", req.file);

    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({ message : "User not found." });
    }

    if(user.profilePic){
      const oldKey = user.profilePic.split('/').slice(3).join('/');
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: oldKey,
      };
      try{
        await s3Client.send(new DeleteObjectCommand(deleteParams));
      }catch (error) {
        console.log("error : ",error);
        throw new Error("Profile image updating error.");
      }
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `providerProfileImages/${userId}.${file.originalname
        .split(".")
        .pop()}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const upload = new Upload({
      client: s3Client,
      params: params,
    });

    const s3UploadResponse = await upload.done();

    let updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: s3UploadResponse.Location },
      { 
        projection : {createdAt: 0, updatedAt: 0, followersCount: 0, followingsCount: 0, postsCount: 0, password: 0},
        new: true 
      },
    );

    const signedUrl = await generateSignedUrl(updatedUser.profilePic);
    updatedUser.profilePic = signedUrl;

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
