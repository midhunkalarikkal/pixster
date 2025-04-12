import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { Upload } from "@aws-sdk/lib-storage";
import { generateSignedUrl, s3Client } from "../utils/aws.config.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import dotenv from "dotenv";
import { generateRandomString } from "../utils/helper.js";
import PostLike from "../models/postLike.model.js";
import Notification from "../models/notification.model.js";
import { Types } from "mongoose";
import { getReceiverSocketId } from "../lib/socket.js";
dotenv.config();

export const uploadPost = async (req, res) => {
  try {
    const currentUser = req.user?._id;

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

    const randomString = await generateRandomString();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `talkzyUsersPostsImages/${
        currentUser + randomString + file.originalname
      }`,
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

    if (!currentUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.media) {
      const oldKey = post.media.split("/").slice(3).join("/");
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: oldKey,
      };
      try {
        await s3Client.send(new DeleteObjectCommand(deleteParams));
      } catch (error) {
        console.log("error catch block : ", error);
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

export const updatePost = async (req, res) => {
  try {
    console.log("updating post");
    const currentUser = req.user?._id;
    const { postId } = req.params;

    const { caption } = req.body;
    const file = req.file;

    if (!currentUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const post = await Post.findById(postId, {
      updatedAt: 0,
      likes: 0,
      commentsCount: 0,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (file) {
      if (post.media) {
        const oldKey = post.media.split("/").slice(3).join("/");
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: oldKey,
        };
        try {
          await s3Client.send(new DeleteObjectCommand(deleteParams));
        } catch (error) {
          throw new Error("post image deleting error.");
        }
      }

      const randomString = await generateRandomString();

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `talkzyUsersPostsImages/${
          currentUser + randomString + file.originalname
        }`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const upload = new Upload({
        client: s3Client,
        params: params,
      });

      const s3UploadResponse = await upload.done();
      post.media = s3UploadResponse.Location;
    }

    if (caption) {
      post.content = caption;
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
    });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const likeOrDislikePost = async (req, res) => {
  try {
    console.log("post liking or disliking");
    const currentUserId = req.user?._id;
    const { postId } = req.params;

    console.log("currenUserID : ",currentUserId);
    console.log("postId : ",postId);

    if (!currentUserId || !postId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await User.findById(currentUserId);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "No post found" });
    }

    if (String(post?.userId) === String(currentUserId)) {
      return res.status(403).json({ message: "You cannot like your own post" });
    }

    const existLike = await PostLike.findOne({
      userId: currentUserId,
      postId: postId,
    });

    let newNotification;

    if (existLike) {
      console.log("post dislikign")
      await PostLike.findByIdAndDelete(existLike._id);

      await Post.findByIdAndUpdate(postId,{ $inc : { likes : -1 }});

      return res.status(200).json({ message: "You have disliked a post", liked: false, disliked: true });
    } else {
      console.log("post liking")
      const newLike = new PostLike({
        userId: currentUserId,
        postId: postId,
      });

      await newLike.save();

      await Post.findByIdAndUpdate(postId,{ $inc : { likes : 1 }});

      newNotification = new Notification({
        message: "Liked your post",
        toUserId: post.userId,
        fromUserId: currentUserId,
        notificationType: "postLiked",
      });
      await newNotification.save();

      await newNotification.populate({
        path: "fromUserId",
        select: "userName fullName profilePic",
      });

      if(newNotification.fromUserId.profilePic) {
        newNotification.fromUserId.profilePic = await generateSignedUrl(newNotification.fromUserId.profilePic)
      }
  
      const postLikeSocketData = {
        notification: newNotification,
      };
  
      const receiverSocketId = getReceiverSocketId(post.userId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("postLikeSocket", postLikeSocketData);
      }
  
      return res.status(200).json({ message: "You have liked a post", liked: true, disliked: false });
    }

  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
