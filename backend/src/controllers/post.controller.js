import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../utils/aws.config.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import dotenv from "dotenv";
dotenv.config();

export const uploadPost = async (req, res) => {
  try {
    const currentUser = req.user?._id;
    console.log("req.body : ", req.body);
    console.log("req.file : ", req.file);

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

    if (caption.length < 1 || caption.length > 200) {
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
    await User.findByIdAndUpdate(currentUser, { $inc: { postsCount: 1 } });

    return res
      .status(201)
      .json({ success: true, message: "Post uploaded successfully" });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const deletePost = async (req, res) => {
  try {
    const currentUser = req.user?._id;
    const { postId } = req.params;
    console.log("req.body : ", req.body);
    console.log("req.file : ", req.file);

    const { caption } = req.body;
    const file = req.file;

    if (!currentUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    console.log("post : ",post);
    if (post.media) {
      const oldKey = post.media.split("/").slice(3).join("/");
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: oldKey,
      };
      try {
        await s3Client.send(new DeleteObjectCommand(deleteParams));
      } catch (error) {
        console.log("error catch block : ",error);
        throw new Error("post image deleting error.");
      }
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
