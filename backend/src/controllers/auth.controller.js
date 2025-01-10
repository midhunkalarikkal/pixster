import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js";
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req,res) => {
    const { fullName , email , password } = req.body;
    try{

        if(!fullName || !email || !password){
            return res.status(400).json({ message : "Fill all fields." });
        }

        if(fullName.length < 4){
            return res.status(400).json({ message : "Fullname must be at least 4 characters." });
        }else if(fullName.length > 40){
            return res.status(400).json({ message : "Fullname must be less than 40 characters." });
        }

        if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
            return res.status(400).json({ message : "Invalid email." });
        }


        if(password.length < 6){
            return res.status(400).json({ message : "Password must be at least 6 characters." });
        }else if(password.length > 40){
            return res.status(400).json({ message : "Password must be less than 40 characters." });
        }
        
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({ message : "Email already exist." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password : hashedPassword
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            
            return res.status(201).json({
                id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic,
            })
        }else{
            return res.status(400).json({ message : "Invalid user data." });
        } 
    }catch(error){
        console.log("error in signup controller ",error);
        return res.status(500).json({ message : "Internal server error." });
    }
}

export const login = async (req,res) => {
    const { email, password } = req.body;
    try{

        if(!email || !password){
            return res.status(400).json({ message : "Fill all fields."});
        }

        if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
            return res.status(400).json({ message : "Invalid email." });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message : "Invalid credentials." })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({ message : "Invalid credentials" });
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
            profilePic : user.profilePic
        })
        
    }catch(error){
        console.log("error in login controller");
        return res.status(500).json({ message : "Internal server error." });
    }
}

export const logout = (req,res) => {
    try{
        res.cookie("jwt","",{ maxAge : 0});
        return res.status(200).json({ message : "Logged out successfully." });
    }catch(error){
        console.log("error in logout controller.");
        return req.status(500).json({ message : "Internal server error." })
    }
}

export const updateProfile = async (req,res) => {
    try{
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({ message : "Profile image is required." });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId, {profilePic : uploadResponse.secure_url}, {new : true});

        return res.status(200).json(updateUser);
    }catch(error){
        console.log("error in user profile image updation controller", error);
        return res.status(500).json({ message : "Internal server error." });
    }
}

export const checkAuth = async (req,res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("error in checkAuth controller.",error);
        return res.status(500).json({ message : "Internal server error." });
    }
}