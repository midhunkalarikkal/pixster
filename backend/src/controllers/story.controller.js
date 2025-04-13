import Story from "../models/story.model.js";
import { Upload } from "@aws-sdk/lib-storage";
import { generateRandomString } from "../utils/helper.js";
import { generateSignedUrl, s3Client } from "../utils/aws.config.js";

import dotenv from "dotenv";
dotenv.config();

export const uploadStory = async (req, res) => {
  try {
    const currentUser = req.user?._id;
    const file = req.file;

    if (!currentUser) {
      return res.status(400).json({ message: "User not found." });
    }

    if (!file) {
      return res.status(400).json({ message: "Image not found." });
    }

    const randomString = await generateRandomString();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `talkzyUsersStoryImages/${
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

    const newStory = new Story({
      userId: currentUser,
      img: s3UploadResponse.Location,
    });

    const updatedStory = await newStory.save();

    updatedStory.img = await generateSignedUrl(updatedStory.img);

    console.log("updatedStory : ",updatedStory);

    return res
      .status(201)
      .json({ success: true, message: "Story uploaded successfully", story: updatedStory });

  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
