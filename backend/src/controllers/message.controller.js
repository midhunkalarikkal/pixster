import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in getUsersForSidebar ", error);
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
    console.log("error in getMessage controller ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    console.log("req.body : ", req.body);
    const { id: recieverId } = req.params;
    const currentUserId = req.user._id;

    let imageUrl;
    if (image) {
      console.log("image : ", image);
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

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controller ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
