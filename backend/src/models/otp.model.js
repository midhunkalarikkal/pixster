import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    otp : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expired : 300
    }
},
{
    timestamps : true
});

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;