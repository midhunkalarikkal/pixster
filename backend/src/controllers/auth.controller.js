import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req,res) => {
    const { fullName , email , password } = req.body;
    try{

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
            await generateToken(newUser._id, res);
            await newUser.save();
            
            return res.status(201).sjon({
                id : newUser._id,
                fullName : newUser.fullname,
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