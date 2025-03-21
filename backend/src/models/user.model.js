import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            required : true,
            trim : true,
            minLength: 4,
            maxLength: 25,
        },
        userName : {
            type : String,
            required : true,
            unique: true,
            trim : true,
            minLength: 6,
            maxLength: 25,
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
        },
        password : {
            type : String,
            required : true,
            minlength : 6,
            trim : true,
        },
        profilePic : {
            type : String,
            default : null,
        },
        about : {
            type: String,
            minLength: 5,
            maxLength: 150,
            default : "This about is from Talkzy, you can update.",
            trim : true,
        },
        followersCount : {
            type : Number,
            default: 0,
        },
        followingCount : {
            type : Number,
            default : 0,
        },
        postsCount : {
            type : Number,
            default : 0,
        }
    },{
        timestamps : true
    }
);

const User = mongoose.model("User",userSchema);
export default User;