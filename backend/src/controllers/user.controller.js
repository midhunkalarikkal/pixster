import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";

export const searchUsers = async (req, res) => {
  try {
    console.log("req.user : ", req.user);
    const currentUser = req.user?._id;
    const { searchQuery } = req.query;
    const query = searchQuery?.trim().toLowerCase();

    if (!query) {
      return res.status(400).json({ message: "Invalid or missing query." });
    }

    const users = await User.find(
      {
        $or: [
          { fullName: { $regex: query, $options: "i" } },
          { userName: { $regex: query, $options: "i" } },
        ],
      },
      { _id: 1, fullName: 1, userName: 1, profilePic: 1 }
    );

    return res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchSearchedUserProfile = async (req, res) => {
  try {
    const currentUser = req.user?._id;
    const { userId } = req.params;

    const userData = await User.findById(userId).select(
      "_id fullName userName profilePic about postsCount followersCount followingCount"
    );

    const connectionData = await Connection.findOne(
      { fromUserId: currentUser, toUserId: userId },
      { _id: 0, status: 1 }
    );

    const revConnection = await Connection.findOne(
      { fromUserId: userId, toUserId: currentUser },
      { _id: 0, status: 1 }
    );

    const userPosts = await Post.find({ userId: userId });

    return res.status(200).json({
      message: "User profile fetched successfully",
      userData,
      connectionData,
      userPosts,
      revConnection,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchRequestedAccounts = async (req, res) => {
  try {
    const fromUserId = req.user?._id;
    if (!fromUserId) {
      return res.status(400).json({ message: "User not found." });
    }

    const requestedToUserIds = await Connection.find({
      fromUserId,
      status: "requested",
    }).distinct("toUserId");

    const users = await User.find({ _id: { $in: requestedToUserIds } });

    return res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchFollowingAccounts = async (req, res) => {
  try {
    const fromUserId = req.user?._id;
    if (!fromUserId) {
      return res.status(400).json({ message: "User not found." });
    }

    const requestedToUserIds = await Connection.find({
      fromUserId,
      status: "accepted",
    }).distinct("toUserId");

    const users = await User.find({ _id: { $in: requestedToUserIds } });

    return resstatus(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications");
    const currentUser = req.user?._id;
    if (!currentUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const notifications = await Notification.find(
      { toUserId: currentUser },
      { updatedAt: 0, __v: 0 }
    )
      .sort({ createdAt: -1 })
      .populate({
        path: "fromUserId",
        select: "userName fullName profilePic _id",
      });

    return resstatus(200).json({ message: "Users fetched successfully", notifications });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchSuggestions = async (req, res) => {
  try {
    console.log("Suggestion controller");
    const currentUser = req.user?._id;
    if (!currentUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const suggestions = await Connection.find({
      $and: [
        {
          $or: [{ fromUserId: currentUser }, { toUserId: currentUser }],
        },
        {
          status: "accepted",
        },
      ],
    });


    return res.status(200).json({ message: "Suggestions fetched successfully", suggestions });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const uploadPost = async (req, res) => {
  try {
    const currentUser = req.user?._id;
    const { postImage, postCaption } = req.body;

    if (!currentUser) {
      return res.status(400).json({ message: "User not found." });
    }

    if (!postImage) {
      return res.status(400).json({ message: "Image not found." });
    }

    if (!postCaption) {
      return res.status(400).json({ message: "Caption not found." });
    }

    if(postCaption.length < 1 || postCaption.length > 200) {
      return res.status(400).json({ message: "Pos captionlength error." });
    }

    const uploadResponse = await cloudinary.uploader.upload(postImage, {
      folder: "usersPostMedias",
    });

    const newPost = new Post({
      userId: currentUser,
      media: uploadResponse.secure_url,
      content: postCaption,
    });
    const savedPost = await newPost.save();
    const updatedUser = await User.findByIdAndUpdate(currentUser, { $inc : { postsCount : 1 }});

    return res.status(201).json({ success: true, message: "Post uploaded successfully" });
  } catch (error) {
    console.log("error : ",error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
