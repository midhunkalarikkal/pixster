import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import { generateSignedUrl } from "../utils/aws.config.js";

import dotenv from "dotenv";
dotenv.config();

export const homeScrollerData = async (req, res) => {
  try {
    const currentUserId = req?.user?._id;
    if (!currentUserId) {
      return res
        .status(404)
        .json({ message: "Something went wrong, please login again" });
    }

    const user = await User.findById(currentUserId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Something went wring, please login again" });
    }

    const postData = await Connection.aggregate([
      {
        $match: { fromUserId: user?._id, status: "accepted" },
      },
      {
        $lookup: {
          from: "users",
          localField: "toUserId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: "$userDetails._id",
          userName: "$userDetails.userName",
          profilePic: "$userDetails.profilePic",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "userPostDetails",
        },
      },
      {
        $unwind: "$userPostDetails",
      },
      {
        $sort : { "userPostDetails.createdAt" : -1 }
      }
    ]);

    const updatedPostData = await Promise.all(
      postData.map(async (post) => {
        let signedProfilePic = post.profilePic;
        let signedMedia = post.userPostDetails?.media;

        if (post?.profilePic) {
          signedProfilePic = await generateSignedUrl(post.profilePic);
        }

        if (post?.userPostDetails?.media) {
          signedMedia = await generateSignedUrl(post.userPostDetails.media);
        }

        return {
          ...post,
          profilePic: signedProfilePic,
          userPostDetails: {
            ...post.userPostDetails,
            media: signedMedia,
          },
        };
      })
    );

    return res
      .status(200)
      .json({ message: "Home scroll data fetched.", posts: updatedPostData });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

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
        if (!user.profilePic) return user;
        const signedUrl = await generateSignedUrl(user.profilePic);
        return {
          ...user,
          profilePic: signedUrl,
        };
      })
    );

    return res
      .status(200)
      .json({ message: "Users fetched successfully", users: updatedUsers });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchSearchedUserProfile = async (req, res) => {
  try {
    const currentUser = req.user?._id;
    const { userId } = req.params;

    console.log("currentUser : ", currentUser);
    console.log("userId : ", userId);

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

    console.log("connectionData : ", connectionData);

    const revConnectionData = await Connection.findOne(
      { fromUserId: userId, toUserId: currentUser },
      { _id: 0, status: 1 }
    );

    console.log("revConnectionData : ", revConnectionData);

    let updatedUserPosts = [];
    const isOwnProfile = currentUser?.toString() === userId;
    if (
      (connectionData && connectionData?.status === "accepted") ||
      isOwnProfile
    ) {
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

    if (userData.profilePic) {
      userData.profilePic = await generateSignedUrl(userData.profilePic);
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      userData,
      connectionData,
      revConnectionData,
      userPosts: updatedUserPosts,
    });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchRequestedAccounts = async (req, res) => {
  try {
    console.log("fetching");
    const fromUserId = req.user?._id;
    if (!fromUserId) {
      return res.status(400).json({ message: "User not found." });
    }

    const requestedToUserIds = await Connection.find({
      fromUserId,
      status: "requested",
    }).distinct("toUserId");

    const users = await User.find(
      { _id: { $in: requestedToUserIds } },
      { _id: 1, userName: 1, fullName: 1, profilePic: 1 }
    );

    let updatedUsers = await Promise.all(
      users.map(async (user) => {
        if (!user.profilePic) return user;

        const signedUrl = await generateSignedUrl(user.profilePic);

        return {
          ...user,
          profilePic: signedUrl,
        };
      })
    );

    console.log("requested profile : ", updatedUsers);

    return res
      .status(200)
      .json({ message: "Users fetched successfully", users: updatedUsers });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchIncomingRequestedAccounts = async (req, res) => {
  try {
    console.log("fetching");
    const fromUserId = req.user?._id;
    if (!fromUserId) {
      return res.status(400).json({ message: "User not found." });
    }

    const incomingRequestedToUserIds = await Connection.find({
      toUserId: fromUserId,
      status: "requested",
    }).distinct("fromUserId");

    const users = await User.find(
      { _id: { $in: incomingRequestedToUserIds } },
      { _id: 1, userName: 1, fullName: 1, profilePic: 1 }
    ).lean();

    let updatedUsers = await Promise.all(
      users.map(async (user) => {
        if (!user.profilePic) return user;

        const signedUrl = await generateSignedUrl(user.profilePic);

        return {
          ...user,
          profilePic: signedUrl,
        };
      })
    );

    console.log("incoming requested profile : ", updatedUsers);

    return res
      .status(200)
      .json({ message: "Users fetched successfully", users: updatedUsers });
  } catch (error) {
    console.log("error : ", error);
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

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingUsersIds = await Connection.find({
      fromUserId: userId,
      status: "accepted",
    }).distinct("toUserId");

    const users = await User.find(
      { _id: { $in: followingUsersIds } },
      { _id: 1, userName: 1, fullName: 1, profilePic: 1 }
    );

    let updatedUsers = await Promise.all(
      users.map(async (user) => {
        if (!user.profilePic) return user;

        const signedUrl = await generateSignedUrl(user.profilePic);

        return {
          ...user,
          profilePic: signedUrl,
        };
      })
    );

    console.log("following accounts : ", updatedUsers);

    return res
      .status(200)
      .json({ message: "Users fetched successfully", users: updatedUsers });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchFollowersAccounts = async (req, res) => {
  try {
    const fromUserId = req.user?._id;
    const { userId } = req.params;

    if (!fromUserId) {
      return res.status(404).json({ message: "Please login and try again." });
    }

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersUsersIds = await Connection.find({
      toUserId: userId,
      status: "accepted",
    }).distinct("fromUserId");

    const users = await User.find(
      { _id: { $in: followersUsersIds } },
      { _id: 1, userName: 1, fullName: 1, profilePic: 1 }
    );

    let updatedUsers = await Promise.all(
      users.map(async (user) => {
        if (!user.profilePic) return user;

        const signedUrl = await generateSignedUrl(user.profilePic);

        return {
          ...user,
          profilePic: signedUrl,
        };
      })
    );

    console.log("following accounts : ", updatedUsers);

    return res
      .status(200)
      .json({ message: "Users fetched successfully", users: updatedUsers });
  } catch (error) {
    console.log("error : ", error);
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
      })
      .lean();

    const updatedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        if (!notification?.fromUserId?.profilePic) return notification;

        const signedUrl = await generateSignedUrl(
          notification?.fromUserId?.profilePic
        );

        return {
          ...notification,
          fromUserId: {
            ...notification.fromUserId,
            profilePic: signedUrl,
          },
        };
      })
    );

    return res
      .status(200)
      .json({
        message: "Users fetched successfully",
        notifications: updatedNotifications,
      });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchSuggestions = async (req, res) => {
  try {
    console.log("Suggestion controller");
    const currentUserId = req.user?._id;
    if (!currentUserId) {
      return res.status(400).json({ message: "User not found." });
    }

    const suggestionUsersIds = await Connection.aggregate([
    {
      $match : {
        status: "accepted",
        $or : [
          { fromUserId : currentUserId },
          { toUserId : currentUserId }
        ]
      }
    },
    {
      $project : {
        _id : 0,
        userId : {
          $cond : {
            if : { $eq : [ "$fromUserId", currentUserId ] },
            then : "$toUserId",
            else : "$fromUserId",
          }
        }
      }
    },
    {
      $group : {
        _id : null,
        friendsIds : { $addToSet : "$userId" }
      }
    },
    {
      $lookup : {
        from : "connections",
        let : { friendsList : "$friendsIds"},
        pipeline : [
          {
            $match : {
              status : "accepted",
              $expr : {
                $or : [
                  { $in : [ "$fromUserId", "$$friendsList" ]},
                  { $in : [ "$toUserId", "$$friendsList" ]}
                ]
              }
            }
          },
          {
            $project : {
              userId : {
                $cond : {
                  if : { $in : [ "$fromUserId", "$$friendsList" ] },
                  then : "$toUserId",
                  else : "$fromUserId",
                }
              }
            }
          },
          {
            $match : {
              $expr : {
                $and : [
                  { $ne : [ "$userId", currentUserId ] },
                  { $not : [ { $in : [ "$userId", "$$friendsList" ] } ] }
                ]
              }
            }
          }
        ],
        as : "suggestions"
      }
    },
    {
      $unwind : "$suggestions"
    },
    {
      $replaceRoot : {
        newRoot : "$suggestions"
      }
    },
    {
      $group : {
        _id : null,
        userIds : { "$addToSet" : "$userId" }
      }
    },
    {
      $project : {
        _id : 0,
        userIds : 1
      }
    }
    ]);

    const suggestionUsersIdsArray = suggestionUsersIds[0]?.userIds || [];

    const users = await User.find({
      _id : {
        $in : suggestionUsersIdsArray
      }
    }, { userName: 1, fullName: 1, profilePic: 1 });

    const updatedUsers = await Promise.all(
      users.map( async (user) => {
        if(!user?.profilePic) return user;

        const signedUrl = await generateSignedUrl(user?.profilePic);

        return {
          ...user,
          profilePic : signedUrl,
        }
      })
    )

    return res
      .status(200)
      .json({ message: "Suggestions fetched successfully", suggestions: updatedUsers });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
