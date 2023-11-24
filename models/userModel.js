import mongoose from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import validator from 'validator';
import Otp from "./otpModel.js";
import { stackSchema } from "./stackModel.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  stacks: {
    type: [stackSchema],
    default: [],
  },
});


userSchema.statics.signup = async function(username, email, password, otp) {
  if (!email || !password || !username || !otp) {
    throw new Error('All fields are required');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }
  
  const exists = await this.findOne({ email });
  
  if (exists) {
    throw new Error('This email is already registered');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error('Weak Password');
  }

  const otpMatch = await Otp.findOne({ email });

  if (otp !== otpMatch.otp) {
    throw new Error("Invalid OTP");
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const user = await this.create({ username, email, password: hashedPassword });

  return user;
}

userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw new Error('All fields are required');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Email not registered');
  }

  const match = await compare(password, user.password);

  if (!match) {
    throw new Error('Invalid email or password');
  }

  return user;
}

userSchema.statics.updateUser = async function(username, _id) {
  if (!username) {
    throw new Error("Username cannot be empty");
  }

  const user = await this.findById(_id);

  if (user.username === username) {
    throw new Error("No changes made");
  }
  
  const updatedUser = await this.findByIdAndUpdate(_id, { username }, { new: true });

  return updatedUser; 
}

export default mongoose.model('User', userSchema);