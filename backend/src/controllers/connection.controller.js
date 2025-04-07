import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const requestConnection = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.params;
    const { status } = req.query;

    if(!fromUserId || !toUserId || !status){
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

    if (connection) {
      if (connection.status === status) {
        return res
          .status(400)
          .json({ message: `Connection already ${status}.` });
      }
    } else {
      connection = new Connection({
        fromUserId,
        toUserId,
        status,
      });
      await connection.save();

      const newNotification = new Notification({
        message: "Wants to follow you.",
        toUserId: toUserId,
        fromUserId: fromUserId,
        notificationType: "followRequest",
      });
      await newNotification.save();
    }

    const userData = await User.findById(toUserId).select(
      "-password -createdAt -email"
    );
    const connectionData = await Connection.findOne(
      { fromUserId, toUserId },
      { _id: 0, status: 1 }
    );

    return res
      .status(200)
      .json({
        message: "Your request has been sent.",
        userData,
        connectionData,
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.params;
    const { status } = req.query;
    console.log("fromUserId : ", fromUserId);
    console.log("toUserId : ",toUserId);
    console.log("status : ",status);

    if(!fromUserId || !toUserId || !status){
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

    console.log("connection : ",connection);

    if(connection.status === "accepted"){
      return res.status(400).json({ message: "Connection already exist." });
    }

    connection.status = status;
    await connection.save();

    const newNotification = new Notification({
      message: "accepted your request",
      toUserId: toUserId,
      fromUserId: fromUserId,
      notificationType: "requestAccept"
    });
    await newNotification.save();

    const updateFromUser = await User.findByIdAndUpdate( fromUserId, { $inc : { followersCount : 1}}, { new : true });
    const userData = await User.findByIdAndUpdate( toUserId, { $inc : { followingCount : 1 }}, { new : true }).select(" -password -createdAt -email -updatedAt");

    const connectionData = await Connection.findOne(
      { fromUserId: toUserId, toUserId: fromUserId },
      { _id: 0, status: 1 }
    );

    console.log("userData : ",userData);
    console.log("connectionData : ",connectionData);

    return res
      .status(200)
      .json({
        message: "You have accepted the request.",
        userData,
        connectionData,
      });

  } catch (error) {
    console.log("error : ",error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const rejectConnection = async (req, res) => {
  try{
    const fromUserId = req.user.id;
    const { toUserId } = req.params;
    const { status } = req.query;
    console.log("fromUserId : ", fromUserId);
    console.log("toUserId : ",toUserId);
    console.log("status : ",status);

    if(!fromUserId || !toUserId || !status){
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

    console.log("connection : ",connection);

    if(connection.status === "rejected"){
      return res.status(400).json({ message: "Connection already rejected." });
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

    return res
      .status(200)
      .json({
        message: "Request has been rejected.",
        userData,
        connectionData,
      });
    
  }catch (error) {
    console.log("error : ",error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
