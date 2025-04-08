import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

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

    const existingToUser = await User.findById(toUserId);
    if (!existingToUser) {
      return res.status(400).json({ message: "User not found." });
    }

    let connection = await Connection.findOne({
      fromUserId,
      toUserId,
    });

    let newNotification;
    if (connection) {
      console.log("if");
      if (connection.status === status) {
        return res
          .status(400)
          .json({ message: `Connection already ${status}.` });
      } else if (
        connection.status === "cancelled" ||
        connection.status === "rejected" ||
        connection.status === "unfollowed"
      ) {
        connection.status = status;
        await connection.save();

        newNotification = new Notification({
          message: "Wants to follow you.",
          toUserId: toUserId,
          fromUserId: fromUserId,
          notificationType: "followRequest",
        });

        newNotification = await newNotification.save();
      }
    } else {

      connection = new Connection({
        fromUserId,
        toUserId,
        status,
      });

      const newConnection = await connection.save();

      const notification = new Notification({
        message: "Wants to follow you.",
        toUserId: toUserId,
        fromUserId: fromUserId,
        notificationType: "followRequest",
      });

      newNotification = await notification.save();
    }

    const userData = await User.findById(toUserId).select(
      "-password -createdAt -email"
    );

    const connectionData = await Connection.findOne(
      { fromUserId, toUserId },
      { _id: 0, status: 1 }
    );

    console.log("new notification : ",newNotification);
    await newNotification.populate({
      path: "fromUserId",
      select: "userName fullName profilePic"
    });


    const followRequestData = { 
      message : "You have a new follow request.",
      notification: newNotification
    };
    
    const receiverSocketId = getReceiverSocketId(toUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("followRequest", followRequestData);
    }

    return res.status(200).json({
      message: `Follow request sent to ${userData.fullName}.`,
      userData,
      connectionData,
    });
  } catch (error) {
    console.log("error : ",error);
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

    let connection = await Connection.findOne({
      fromUserId: toUserId,
      toUserId: fromUserId,
    });


    if (connection.status === "accepted") {
      return res.status(400).json({ message: "Connection already exist." });
    }

    connection.status = status;
    await connection.save();

    const newNotification = new Notification({
      message: "accepted your request",
      toUserId: toUserId,
      fromUserId: fromUserId,
      notificationType: "requestAccept",
    });
    await newNotification.save();

    const updateFromUser = await User.findByIdAndUpdate(
      fromUserId,
      { $inc: { followersCount: 1 } },
      { new: true }
    );
    const userData = await User.findByIdAndUpdate(
      toUserId,
      { $inc: { followingCount: 1 } },
      { new: true }
    ).select(" -password -createdAt -email -updatedAt");

    const receiverSocketId = getReceiverSocketId(toUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("requestAccepted", fromUserId);
    }

    return res.status(200).json({
      message: `You have accepted ${userData.fullName}'s follow request`,
      userData,
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

    const existingToUser = await User.findById(toUserId);
    if (!existingToUser) {
      return res.status(400).json({ message: "User not found." });
    }

    let connection = await Connection.findOne({
      fromUserId: toUserId,
      toUserId: fromUserId,
    });

    console.log("connection : ", connection);

    if (connection.status === "rejected") {
      return res.status(400).json({ message: "Connection already rejected." });
    }

    connection.status = status;
    await connection.save();

    const userData = await User.findById(toUserId).select(
      "-password -createdAt -email"
    );

    // const connectionData = await Connection.findOne(
    //   { fromUserId, toUserId },
    //   { _id: 0, status: 1 }
    // );

    return res.status(200).json({
      message: `You have rejected ${userData.fullName}'s follow request`,
      userData,
      // connectionData,
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
    const  { status }  = req.query;
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

    const existingToUser = await User.findById(toUserId);
    if (!existingToUser) {
      return res.status(400).json({ message: "User not found." });
    }

    let connection = await Connection.findOne({
      fromUserId,
      toUserId,
    });


    if (connection.status === "cancelled") {
      return res.status(400).json({ message: "Connection already cancelled." });
    } else if ( connection.status === "accepted") {
      return res.status(400).json({ message: "Your request has been accpted, you can unfollow from thier account." });
    }

    connection.status = status;
    await connection.save();

    const userData = await User.findById(toUserId).select(
      "-password -createdAt -email"
    );

    const connectionData = await Connection.findOne(
      { fromUserId, toUserId },
      { _id: 0, status: 1 }
    );

    return res.status(200).json({
      message: `You  have cancelled your follow request to ${userData.fullName}`,
      userData,
      connectionData,
    });

    
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const unfollowConnection = async (req, res) => {
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

    const allowedStatus = "unfollowed";
    if (allowedStatus !== status) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const existingToUser = await User.findById(toUserId);
    if (!existingToUser) {
      return res.status(400).json({ message: "User not found." });
    }

    let connection = await Connection.findOne({
      fromUserId,
      toUserId,
    });

    console.log("connection : ", connection);

    if (connection.status === "unfollowed") {
      return res
        .status(400)
        .json({ message: "Connection already unfollowing." });
    }

    connection.status = status;
    await connection.save();

    const updateFromUser = await User.findByIdAndUpdate(
      fromUserId,
      { $inc: { followersCount: -1 } },
      { new: true }
    );
    const userData = await User.findByIdAndUpdate(
      toUserId,
      { $inc: { followingCount: -1 } },
      { new: true }
    ).select(" -password -createdAt -email -updatedAt");

    const connectionData = await Connection.findOne(
      { fromUserId, toUserId },
      { _id: 0, status: 1 }
    );

      return res.status(200).json({ message: `You have unfollowed ${userData.fullName}`, userData, connectionData });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
