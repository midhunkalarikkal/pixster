import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";

export const requestConnection = async (req, res) => {
    try {
      const { toUserId } = req.params;
      const { status } = req.query;
      const fromUserId = req.user.id;

      console.log("fromUserId : ",fromUserId);
      console.log("toUserId : ",toUserId);
  
        if (fromUserId === toUserId) {
          return res.status(400).json({ message:"Invalid request." });
        }
  
        const allowedStatus = ["requested", "accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
          return res.status(400).json({ message:"Invalid request." });
        }
  
        const existingToUser = await User.findById(toUserId);
        if (!existingToUser) {
          return res.status(400).json({ message:"User not found." });
        }
  
        const existingConnection = await Connection.findOne({fromUserId, toUserId, status});
        if (existingConnection) {
          return res.status(400).json({ message:"Connection request pending." });
        }
  
        const connection = new Connection({
          fromUserId,
          toUserId,
          status,
        });
  
        const data = await connection.save();
        if(!data) return res.status(400).json({ message : "Please try again." });

        const userData = await User.findById(toUserId);
        const connectionData = await Connection.findOne({ fromUserId: fromUserId, toUserId: toUserId }, { _id : 0, status : 1 });

        if(status === "requested"){
          return res.status(200).json({ message: "Your request has been sent.", userData, connectionData });
        }
      } catch (error) {
        console.log("error : ",error);
        res.send("Something went wrong " + err.message);
      }
}