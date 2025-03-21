import Connection from "../models/connection.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const searchUser = async (req, res) => {
    try{
        const { searchQuery } = req.query;
        const query = searchQuery?.trim().toLowerCase();
        console.log("query : ",query);

        if(!query){
            return res.status(400).json({ message: "Invalid or missing query." });
        }

        const users = await User.find({ userName : { $regex: query, $options: "i" }},{_id: 1, fullName: 1, userName: 1, profilePic: 1 });
        console.log("users : ",users);
        res.json({ message: "Users fetched successfully", users });
    }catch(error){
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const fetchUserProfile = async (req, res) => {
    try{
        const { userId } = req.params;
        console.log("userId : ",userId);
        console.log("CurrentUserId : ",req.user?._id);
        const userData = await User.findById(userId).select("_id fullName userName profilePic about postsCount followersCount followingCount");
        const connectionData = await Connection.findOne({fromUserId : req.user?._id, toUserId : userId },{_id: 0, status: 1});
        const userPosts = await Post.find({userId : userId});
        console.log("userData : ",userData);
        console.log("connectionData : ",connectionData);
        res.json({ message: "User profile fetched successfully", userData, connectionData, userPosts});
    }catch(error){
        return res.status(500).json({ message: "Internal server error." });
    }
}