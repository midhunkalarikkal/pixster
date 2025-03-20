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
  const { fullName, userName, email, password } = req.body;
  console.log("Sign up api")
  console.log(fullName, userName, email, password)
  try {
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

    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const userByUsername = await User.findOne({ userName });
    if (userByUsername) {
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

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
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
      email: user.email,
      profilePic: user.profilePic,
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
    console.log("update profile");
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    console.log("uploadResponse : ",uploadResponse);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error : ",error);
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
