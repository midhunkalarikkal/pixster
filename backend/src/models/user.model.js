import mongoose, { Schema } from 'mongoose';

export const userSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            required : true,
        },
        userName : {
            type : String,
            required : true,
            unique: true,
        },
        email : {
            type : String,
            required : true,
            unique : true,
        },
        password : {
            type : String,
            required : true,
            minlength : 6,
        },
        profilePic : {
            type : String,
            default : "",
        },
        followers : {
            type : [Schema.Types.ObjectId],
            ref : "User",
        },
        following : {
            type : [Schema.Types.ObjectId],
            ref : "User",
        },
        posts : {
            type : [Schema.Types.ObjectId],
            ref : "Post",
        }
    },{
        timestamps : true
    }
);

const User = mongoose.model("User",userSchema);
export default User;