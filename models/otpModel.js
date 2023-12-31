import mongoose from "mongoose";
import User from "./userModel.js";
import otpGenerator from "otp-generator";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 180,
    default: Date.now,
  },
});

otpSchema.statics.generate = async function(email) {
  const match1 = await User.findOne({ email });

  if (match1) {
    throw new Error("This email is already registered");
  }

  const match2 = await this.findOne({ email });
  
  if (match2) {
    const createdAt = new Date(match2.createdAt);
    const timeDiff = Math.floor((Date.now() - createdAt.getTime()) / 1000);
    if (timeDiff > 60) {
      await this.deleteOne({ email });
    } else {
      const error = new Error(timeDiff);
      error.code = 401;
      throw error;
    }
  }

  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const res = await this.create({ email, otp })

  return res.otp;
}

export default mongoose.model("Otp", otpSchema);