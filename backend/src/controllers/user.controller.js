import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";

export const searchUser = async (req, res) => {
  try {
    console.log("req.user : ",req.user);
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
          ]
        },
      { _id: 1, fullName: 1, userName: 1, profilePic: 1 }
    );
    res.json({ message: "Users fetched successfully", users });
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
    )

    const userPosts = await Post.find({ userId: userId });
    res.json({
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
    res.json({ message: "Users fetched successfully", users });
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
    res.json({ message: "Users fetched successfully", users });
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
    ).sort({ createdAt : -1 }).populate({
      path: "fromUserId",
      select: "userName fullName profilePic _id",
    });
    console.log("Notifications:", notifications);

    res.json({ message: "Users fetched successfully", notifications });
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
          status: "accepted"
        },
      ],
    });

    console.log("suggestions : ",suggestions);

    res.json({ message: "Suggestions fetched successfully", suggestions });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchFriendProfile = async (req, res) => {
  try{
    const userId = req.params.userId;
    const currentUser = req.user?._id;
    if (!currentUser || !userId) {
      return res.status(400).json({ message: "User not found." });
    }

    const connection = await Connection.find(
      {fromUserId: currentUser, toUserId: userId}, {_id: 0, status: 1}
    );

    const user = await User.findById(userId).select("-password -updatedAt -createdAt");

    console.log("connection : ",connection);
    
    console.log("user : ",user);

  }catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}
