import User from '../models/userModel.js';
import Otp from "../models/otpModel.js";
import jwt from 'jsonwebtoken';


const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.USER_SECRET, { expiresIn: '3d' });
}

export const userSignup = async (req, res) => {
  const { username, email, password, otp } = req.body;

  try {
    const user = await User.signup(username, email, password, otp);
    const token = createToken(user._id);

    res.status(200).json({ username, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password)
    const token = createToken(user._id);
    const username = user.username;

    res.status(200).json({ username, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const sendOtp = async (req, res) => {
  const email = req.body.email;
  try {
    await Otp.send(email);
    
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const updateUsername = async (req, res) => {
  const { username } = req.body;
  const _id = req.user._id;
  
  try {
    const user = await User.updateUser(username, _id);

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}