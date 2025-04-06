import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";

export const requestConnection = async (req, res) => {
  try {
    const { toUserId } = req.params;
    const { status } = req.query;
    const fromUserId = req.user.id;

    console.log("fromUserId : ", fromUserId);
    console.log("toUserId : ", toUserId);
    console.log("status : ", status);

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
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
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
    }

    const userData = await User.findById(toUserId).select(
      "-password -createdAt -email"
    );
    const connectionData = await Connection.findOne(
      {
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      },
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
    res.send("Something went wrong " + err.message);
  }
};
