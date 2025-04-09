import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validateUsername,
} from "../utils/validator.js";

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
      id: newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      about: newUser.about,
      followersCount: newUser.followerCount,
      followingCount: newUser.followingCount,
      postsCount: newUser.postsCount,
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

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      about: user.about,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
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
    console.log("req.body : ",req.body);
    
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "usersProfileImage",
    });

    console.log("uploadResponse : ", uploadResponse);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
