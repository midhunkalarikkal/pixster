import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    otp : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    }
},
{
    timestamps : true
});

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;