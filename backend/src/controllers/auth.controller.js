import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js"

export const signup = async (req,res) => {
    try{
        const { fullName , email , password } = req.body;

        if(!fullName || !email || !password){
            return res.status(400).json({ message : "Fill all fields." })
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

export const login = (req,res) => {
    res.send("Login route")
}

export const logout = (req,res) => {
    res.send("Logout route")
}