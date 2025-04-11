import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Connection from "../models/connection.model.js";
import { generateSignedUrl } from "../utils/aws.config.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    console.log("list users");
    const currentUserId = req.user._id;

    const users = await Connection.aggregate([
      { $match : {
        status: "accepted",
        $or : [
          { fromUserId: currentUserId},
          { toUserId : currentUserId }
        ]
      }
    },
    {
      $project: { "_id" : 0, "toUserId" : 1 }
    },
    {
      $lookup : {
        from: "users",
        localField: "toUserId",
        foreignField: "_id",
        as: "userData"
      }
    },
    {
      $unwind : "$userData"
    },
    {
      $project: {
        _id: "$userData._id",
        fullName: "$userData.fullName",
        userName: "$userData.userName",
        profilePic: "$userData.profilePic",
        __v: "$userData.__v"
      }
    }
    ]);

    const updatedUsers = await Promise.all(
      users.map( async (user) => {
        if(!user?.profilePic) return user;
        
        const signedUrl = await generateSignedUrl(user?.profilePic);
        
        return {
          ...user,
          profilePic: signedUrl
        }
      })
    )
    
    return res.status(200).json({ users: updatedUsers});
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: currentUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const currentUserId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: currentUserId,
      recieverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(recieverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
