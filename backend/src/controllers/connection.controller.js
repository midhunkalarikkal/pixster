import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";

export const requestConnection = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.params;
    const { status } = req.query;

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const allowedStatus = ["requested", "accepted", "rejected", "cancelled"];
    if (!allowedStatus.includes(status)) {
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

      // Update status
      connection.status = status;
      await connection.save();
    } else {
      // Create new connection
      connection = new Connection({
        fromUserId,
        toUserId,
        status,
      });
      await connection.save();

      const newNotification = new Notification({
        message: "Want to follow you.",
        toUserId: toUserId,
        fromUserId: fromUserId,
        isHaveButton: true,
        buttonText: "Accept",
        notificationType: "followRequest",
      });
      await newNotification.save();
    }

    const userData = await User.findById(toUserId).select(
      "-password -createdAt -email"
    );

    const connectionData = await Connection.findOne(
      { fromUserId, toUserId},
      { _id: 0, status: 1 }
    );

    let message = "Connection updated.";
    if (status === "requested") message = "Your request has been sent.";
    else if (status === "cancelled")
      message = "Your request has been cancelled.";
    else if (status === "accepted") message = "Request accepted.";
    else if (status === "rejected") message = "Request rejected.";

    return res.status(200).json({ message, userData, connectionData });
  } catch (error) {
    res.send("Something went wrong " + error.message);
  }
};
