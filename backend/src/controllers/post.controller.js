import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Saved from "../models/saved.model.js";
import { Upload } from "@aws-sdk/lib-storage";
import Comment from "../models/comment.model.js";
import PostLike from "../models/postLike.model.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { generateRandomString } from "../utils/helper.js";
import Notification from "../models/notification.model.js";
import { generateSignedUrl, s3Client } from "../utils/aws.config.js";

import dotenv from "dotenv";
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

export const savePost = async (req,res) => {
  try {
    console.log("post saving");
    const currentUserId = req.user?._id;
    const { postId } = req.params;

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

    const existing = await Saved.findOne({ postId: postId });
    if(existing) {
      await Saved.findByIdAndDelete(existing._id);

      return res.status(200).json({ message: "Post removed from your saved list.", saved : false, removed : true });
    } else {

      const newSaved = new Saved({
        userId: currentUserId,
        postId: postId
      });

      await newSaved.save();

      return res.status(200).json({ message: "Post saved.", saved : true, removed : false });
    }

  }catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}


export const addComment = async (req, res) => {
  try{
    const currentUserId = req.user._id;
    const { comment, postId } = req.body;

    if(!currentUserId || !comment) {
      return res.status(404).json({ message : "Invalid request." });
    }

    if(comment.length < 0 || comment.length > 200) {
      return res.status(400).json({ message: "Invalid comment." });
    }

    const user = await User.findById(currentUserId);
    if(!user) {
      return res.status(404).json({ message: "No user found, please login again" });
    }

    const post = await Post.findById(postId);
    if(!post) {
      return res.status(404).json({ message : "No post found" });
    }

    const newComment = new Comment({
      postId,
      userId : currentUserId,
      content : comment,
      isRootComment : true,
    });
    await newComment.save();
    
    await Post.findByIdAndUpdate(postId, { $inc : { commentsCount : 1 }});

    const newNotification = new Notification({
      message : `commented on your post.`,
      toUserId: post.userId,
      fromUserId: currentUserId,
      notificationType: "postCommented"
    })
    await newNotification.save();

    await newNotification.populate({
      path : "fromUserId",
      select : "userName fullName profilePic"
    })

    await newComment.populate({
      path : "userId",
      select : "userName profilePic"
    })

    if(newComment?.userId?.profilePic) {
      newComment.userId.profilePic = await generateSignedUrl(newComment?.userId?.profilePic);
    }

    if(newNotification.fromUserId.profilePic) {
      newNotification.fromUserId.profilePic = await generateSignedUrl(newNotification.fromUserId.profilePic); 
    }

    const socketData = {
      notification: newNotification
    }

    const receiverSocketId = getReceiverSocketId(post.userId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("commentedOnPost", socketData);
    }

    return res.status(200).json({
      message : "Comment added successfully.",
      comment: newComment,
    })

  }catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export const getComments = async (req,res) => {
  try {
    console.log("getComments")
    console.log("req.body : ",req.body)
    const { postId } = req.params;

  if(!postId) {
    return res.status(404).json({ message : "Invalid request" });
  }

  const post = await Post.findById(postId);
  if(!post) {
    return res.status(404).json({ message : "No post found" });
  }

  let comments = await Comment.find({ postId : postId }).populate({
    path : "userId",
    select : "userName profilePic"
  }).lean();

  if(!comments) {
    return res.status(400).json({ message : "Comments fetching error" });
  }

  if(comments.length > 0) {
    comments = await Promise.all(
      comments.map( async (comment) => {
        if(!comment.userId.profilePic) return comment;
        
        const signedUrl = await generateSignedUrl(comment.userId.profilePic);
        
        return {
          ...comment,
          userId : {
            ...comment.userId,
            profilePic : signedUrl
          }
        }
      })
    )
  }

  console.log("comments : ",comments);

  return res.status(200).json({ comments });

  }catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export const deleteComment = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { postId, commentId } = req.params;

    if(!currentUserId || !commentId) {
      return res.status(404).json({ message : "Invalid request" });
    }

    const comment = await Comment.findById(commentId);
    if(!comment) {
      return res.status(404).json({ message : "Comment not found" });
    }

    if(currentUserId.toString() !== comment.userId.toString()) {
      return res.status(400).json({ message : "You cant delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(postId, { $inc : { commentsCount :  -1 } } );

    return res.status(200).json({ success : true, message : "Comment deleted successfully" });
  }catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}