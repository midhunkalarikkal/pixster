import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { Upload } from "@aws-sdk/lib-storage";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import { generateSignedUrl, s3Client } from "../utils/aws.config.js";

import dotenv from 'dotenv';
dotenv.config();

export const searchUsers = async (req, res) => {
  try {
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
    ).lean();

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
      if(!user.profilePic) return user;
      const signedUrl = await generateSignedUrl(user.profilePic);
      return {
        ...user,
        profilePic: signedUrl
      }
    })
  );

    return res.status(200).json({ message: "Users fetched successfully", users: updatedUsers });
  } catch (error) {
    console.log("error : ",error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchSearchedUserProfile = async (req, res) => {
  try {
    const currentUser = req.user?._id;
    const { userId } = req.params;

    console.log("currentUser : ",currentUser);
    console.log("userId : ",userId);

    const userData = await User.findById(userId).select(
      "_id fullName userName profilePic about postsCount followersCount followingsCount"
    );

    if (!userData) {
      return res.status(404).json({ message: "User not found." });
    }

    const connectionData = await Connection.findOne(
      { fromUserId: currentUser, toUserId: userId },
      { _id: 0, status: 1 }
    );

    console.log("connectionData : ",connectionData);

    const revConnectionData = await Connection.findOne(
      { fromUserId: userId, toUserId: currentUser },
      { _id: 0, status: 1 }
    );

    console.log("revConnectionData : ",revConnectionData);

    let updatedUserPosts = [];
    const isOwnProfile = currentUser?.toString() === userId;
    if (connectionData && connectionData?.status === "accepted" || isOwnProfile) {
      const userPosts = await Post.find({ userId }).lean();

      updatedUserPosts = await Promise.all(
        userPosts.map(async (post) => {
          const signedUrl = await generateSignedUrl(post.media);
          return {
            ...post,
            media: signedUrl,
          };
        })
      );
    }

    if(userData.profilePic){
      userData.profilePic = await generateSignedUrl(userData.profilePic);
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      userData,
      connectionData,
      revConnectionData,
      userPosts : updatedUserPosts,
    });

  } catch (error) {
    console.log("error : ",error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchRequestedAccounts = async (req, res) => {
  try {
    console.log("fetching")
    const fromUserId = req.user?._id;
    if (!fromUserId) {
      return res.status(400).json({ message: "User not found." });
    }

    const requestedToUserIds = await Connection.find({
      fromUserId,
      status: "requested",
    }).distinct("toUserId");

    const users = await User.find({ _id: { $in: requestedToUserIds } }, {_id: 1, userName: 1, fullName: 1, profilePic: 1 });

    let updatedUsers = await Promise.all(users.map( async (user) => {
      if(!user.profilePic) return user;

      const signedUrl = await generateSignedUrl(user.profilePic);

      return {
        ...user,
        profilePic: signedUrl
      }
  }))

  console.log("requested profile : ", updatedUsers);

    return res.status(200).json({ message: "Users fetched successfully", users: updatedUsers });
  } catch (error) {
    console.log("error : ",error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchFollowingAccounts = async (req, res) => {
  try {
    const fromUserId = req.user?._id;
    const { userId } = req.params;

    if (!fromUserId) {
      return res.status(404).json({ message: "Please login and try again." });
    }

    if(!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const myFollowingUsersIds = await Connection.find({
      userId,
      status: "accepted",
    }).distinct("toUserId");

    const users = await User.find({ _id: { $in: myFollowingUsersIds } }, {_id: 1, userName: 1, fullName: 1, profilePic: 1 });

    let updatedUsers = await Promise.all(users.map( async (user) => {
      if(!user.profilePic) return user;

      const signedUrl = await generateSignedUrl(user.profilePic);

      return {
        ...user,
        profilePic: signedUrl
      }
  }))

  console.log("following accounts : ",updatedUsers);

    return res.status(200).json({ message: "Users fetched successfully", users: updatedUsers });
  } catch (error) {
    console.log("error : ",error);
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
    console.log("req.body : ",req.body);
    console.log("req.file : ",req.file);
    
    const { caption } = req.body;
    const file = req.file;

    if (!currentUser) {
      return res.status(400).json({ message: "User not found." });
    }

    if (!file) {
      return res.status(400).json({ message: "Image not found." });
    }

    if (!caption) {
      return res.status(400).json({ message: "Caption not found." });
    }

    if(caption.length < 1 || caption.length > 200) {
      return res.status(400).json({ message: "Pos captionlength error." });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `talkzyUsersPostsImages/${currentUser}.${file.originalname
        .split(".")
        .pop()}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const upload = new Upload({
      client: s3Client,
      params: params,
    });

    const s3UploadResponse = await upload.done();

    const newPost = new Post({
      userId: currentUser,
      media: s3UploadResponse.Location,
      content: caption,
    });

    await newPost.save();
    await User.findByIdAndUpdate(currentUser, { $inc : { postsCount : 1 }});

    return res.status(201).json({ success: true, message: "Post uploaded successfully" });
  } catch (error) {
    console.log("error : ",error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
