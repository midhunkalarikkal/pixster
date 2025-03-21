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
        minLength : 10,
        maxLength : 250,
    },
    likes : {
        type : Number,
        default : null,
    },
    comments : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment",
        default : null,
    }
}, {
    timestamps: true
});

const Post = mongoose.model("Post",postModel);
export default Post;

