import mongoose from "mongoose";

const postModel = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    media : {
        type : String,
    },
    content : {
        type : String,
        required : true,
        minLength : 1,
        maxLength : 250,
    },
    likes : {
        type : Number,
        default : 0,
    },
    commentsCount: {
        type : Number,
        default : 0,
    }
}, {
    timestamps: true
});

const Post = mongoose.model("Post",postModel);
export default Post;

