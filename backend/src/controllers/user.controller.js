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