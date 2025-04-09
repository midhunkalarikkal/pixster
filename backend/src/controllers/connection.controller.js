import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Post from "../models/post.model.js";

export const requestConnection = async (req, res) => {
  try {
    console.log("Send connection request start");
    const fromUserId = req.user.id;
    const { toUserId } = req.params;
    const { status } = req.query;
    console.log("fromUserId : ", fromUserId);
    console.log("toUserId : ", toUserId);
    console.log("status : ", status);

    if (!fromUserId || !toUserId || !status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const allowedStatus = "requested";
    if (allowedStatus !== status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const toUserData = await User.findById(toUserId).select("-password -createdAt -email -updatedAt");
    if (!toUserData) {
      return res.status(400).json({ message: "User not found." });
    }

    let connectionData = await Connection.findOne({ fromUserId, toUserId }, { status: 1 });
    let newNotification;

    if (connectionData) {
      if (connectionData.status === status) {
        return res
          .status(400)
          .json({ message: `Connection already ${status}.` });
      } else if (
        connectionData.status === "cancelled" ||
        connectionData.status === "rejected" ||
        connectionData.status === "unfollowed"
      ) {
        connectionData.status = status;
        connectionData = await connectionData.save();

        newNotification = new Notification({
          message: "Wants to follow you.",
          toUserId: toUserId,
          fromUserId: fromUserId,
          notificationType: "followRequest",
        });

        newNotification = await newNotification.save();
      }
    } else {
      connectionData = new Connection({
        fromUserId,
        toUserId,
        status,
      });
      connectionData = await connectionData.save();

      const notification = new Notification({
        message: "Wants to follow you.",
        toUserId: toUserId,
        fromUserId: fromUserId,
        notificationType: "followRequest",
      });

      newNotification = await notification.save();
    }

    const revConnectionData = await Connection.findOne(
      { fromUserId: toUserId, toUserId: fromUserId },
      { _id: 0, status: 1 }
    );

    await newNotification.populate({
      path: "fromUserId",
      select: "userName fullName profilePic",
    });

    const followRequestData = {
      message: "You have a new follow request.",
      notification: newNotification,
    };

    const receiverSocketId = getReceiverSocketId(toUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("followRequest", followRequestData);
    }

    return res.status(200).json({
      message: `Follow request sent to ${toUserData.fullName}.`,
      userData: toUserData,
      connectionData,
      revConnectionData,
    });

  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.params;
    const { status } = req.query;
    console.log("fromUserId : ", fromUserId);
    console.log("toUserId : ", toUserId);
    console.log("status : ", status);

    if (!fromUserId || !toUserId || !status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const allowedStatus = "accepted";
    if (allowedStatus !== status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const existingToUser = await User.findById(toUserId);
    if (!existingToUser) {
      return res.status(400).json({ message: "User not found." });
    }

    let revConnectionData = await Connection.findOne({
      fromUserId: toUserId,
      toUserId: fromUserId,
    },{status: 1});

    if (revConnectionData && revConnectionData.status === "accepted") {
      return res.status(400).json({ message: "Connection already exist." });
    }

    revConnectionData.status = status;
    revConnectionData = await revConnectionData.save();

    const newNotification = new Notification({
      message: "accepted your request",
      toUserId: toUserId,
      fromUserId: fromUserId,
      notificationType: "requestAccept",
    });
    await newNotification.save();

    await User.findByIdAndUpdate( fromUserId, { $inc: { followingCount: 1 } }, { new: true } );

    const userData = await User.findByIdAndUpdate( toUserId, { $inc: { followersCount: 1 } }, { new: true } ).select(" -password -createdAt -email -updatedAt");

    const connectionData = await Connection.findOne(
      { fromUserId, toUserId },
      { _id: 0, status: 1 }
    );

    const userPosts = await Post.find({ userId : toUserId });

    const requestAcceptedData = {
      fromUserId,
      connectionData: revConnectionData,
      revConnectionData: connectionData,
    }

    const receiverSocketId = getReceiverSocketId(toUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("requestAccepted", requestAcceptedData);
    }

    console.log("connectionData : ",connectionData);
    console.log("revConnectionData : ",revConnectionData);

    return res.status(200).json({
      message: `You have accepted ${userData.fullName}'s follow request`,
      userData,
      connectionData,
      revConnectionData,
      userPosts,
    });

  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.params;
    const { status } = req.query;
    console.log("fromUserId : ", fromUserId);
    console.log("toUserId : ", toUserId);
    console.log("status : ", status);

    if (!fromUserId || !toUserId || !status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const allowedStatus = "rejected";
    if (allowedStatus !== status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const toUserData = await User.findById(toUserId).select("-password -createdAt -email -updatedAt");
    if (!toUserData) {
      return res.status(400).json({ message: "User not found." });
    }

    let connectionData = await Connection.findOne({
      fromUserId: toUserId,
      toUserId: fromUserId,
    });

    console.log("connection : ", connectionData);

    if (connectionData.status === "rejected") {
      return res.status(400).json({ message: "Connection already rejected." });
    }

    connectionData.status = status;
    connectionData = await connectionData.save();

    const revConnectionData = await Connection.findOne(
      { fromUserId, toUserId },
      { _id: 0, status: 1 }
    );

    const userPosts = await Post.find({ userId : toUserId });

    return res.status(200).json({
      message: `You have rejected ${toUserData.fullName}'s follow request`,
      userData: toUserData,
      connectionData,
      revConnectionData,
      userPosts,
    });

  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const cancelConnection = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.params;
    const { status } = req.query;
    console.log("fromUserId : ", fromUserId);
    console.log("toUserId : ", toUserId);
    console.log("status : ", status);

    if (!fromUserId || !toUserId || !status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const allowedStatus = "cancelled";
    if (allowedStatus !== status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const toUserData = await User.findById(toUserId).select("-password -createdAt -email -updatedAt");
    if (!toUserData) {
      return res.status(400).json({ message: "User not found." });
    }

    let connectionData = await Connection.findOne({
      fromUserId,
      toUserId,
    });

    if (connectionData.status === "cancelled") {
      return res.status(400).json({ message: "Connection already cancelled." });
    } else if (connectionData.status === "accepted") {
      return res
        .status(400)
        .json({
          message:
            "Your request has been accpted, you can unfollow from thier account.",
        });
    }

    connectionData.status = status;
    connectionData = await connectionData.save();

    const revConnectionData = await Connection.findOne(
      { fromUserId: toUserId, toUserId: fromUserId },
      { _id: 0, status: 1 }
    );

    return res.status(200).json({
      message: `You  have cancelled your follow request to ${toUserData.fullName}`,
      userData: toUserData,
      connectionData,
      revConnectionData,
    });

  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const unfollowConnection = async (req, res) => {
  try {
    console.log("Unfollow connection");
    const fromUserId = req.user.id;
    const { toUserId } = req.params;
    const { status } = req.query;
    console.log("fromUserId : ", fromUserId);
    console.log("toUserId : ", toUserId);
    console.log("status : ", status);

    if (!fromUserId || !toUserId || !status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const allowedStatus = "unfollowed";
    if (allowedStatus !== status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const existingToUser = await User.findById(toUserId);
    if (!existingToUser) {
      return res.status(400).json({ message: "User not found." });
    }

    let connectionData = await Connection.findOne({
      fromUserId,
      toUserId,
    });

    console.log("connection : ", connectionData);

    if (connectionData.status === "unfollowed") {
      return res
        .status(400)
        .json({ message: "Connection already unfollowing." });
    }

    connectionData.status = status;
    connectionData = await connectionData.save();

    await User.findByIdAndUpdate( fromUserId, { $inc: { followingCount: -1 } } );

    const userData = await User.findByIdAndUpdate( toUserId, { $inc: { followersCount: -1 } }, { new: true } ).select(" -password -createdAt -email -updatedAt");

    const revConnectionData = await Connection.findOne( { fromUserId: toUserId, toUserId: fromUserId }, { _id: 0, status: 1 } );

    console.log("userData : ",userData)
    return res
      .status(200)
      .json({
        message: `You have unfollowed ${userData.fullName}`,
        userData,
        connectionData,
        revConnectionData,
      });

  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
