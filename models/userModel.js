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
  
  await this.findByIdAndUpdate(_id, { username }, { new: true });
}

userSchema.statics.change = async function(oldPass, newPass, _id) {
  if (!oldPass || !newPass) {
    throw new Error("All fields are required");
  }

  const user = await this.findById(_id);

  const match = await compare(oldPass, user.password);

  if (!match) {
    throw new Error("Incorrect Passord");
  }

  if (oldPass === newPass) {
    throw new Error("New password cannot be current password");
  }

  if (!validator.isStrongPassword(newPass)) {
    throw new Error("Weak Password");
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(newPass, salt);

  await this.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true });
}

userSchema.statics.reset = async function(password, _id) {
  if (!password) {
    throw new Error("All fields are required");
  }
  
  const user = await this.findById(_id);
  if (!user) {
    throw new Error("User not found");
  }

  const match = await compare(password, user.password);
  if (match) {
    throw new Error("New password cannot be current password");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Weak Password");
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  await this.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true });
}

export default mongoose.model('User', userSchema);