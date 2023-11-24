import mongoose from "mongoose";
import User from "./userModel.js";
import sendMail from "../utils/transporter.js";
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
    expires: 300,
    default: Date.now,
  },
});

otpSchema.statics.send = async function(email) {
  const match1 = await User.findOne({ email });

  if (match1) {
    throw new Error("This email is already registered");
  }

  const match2 = await this.findOne({ email });
  
  if (match2) {
    return;
  }

  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const res = await this.create({ email, otp })

  if (res) {
    sendMail(email, otp);
  }
}

export default mongoose.model("Otp", otpSchema);