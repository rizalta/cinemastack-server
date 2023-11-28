import User from '../models/userModel.js';
import Otp from "../models/otpModel.js";
import sendMail from "../utils/transporter.js";

import jwt from 'jsonwebtoken';
import { compare } from "bcrypt";



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
    const otp = await Otp.generate(email);

    const mailOptions = {
      from: 'cinemaStack',
      to: email,
      subject: 'Verify your email account',
      html:
        `<html>
          <body style="background-color: white; font-family: Arial, sans-serif; padding: 20px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr bgcolor="black" style="height: 50px; color: white;">
                <td style="padding: 0 10px;"><img src="cid:logo" width="30" height="30" style="display: block;" /></td>
                <td><h1 style="font-family: monospace; margin: 0;">cinemaStack</h1></td>
              </tr>
            </table>
            <h1 style="color: black;">cinemaStack Account Registration</h1>
            <p style="color: black;">Welcome to cinemaStack. Use this OTP to complete your registration.</p>
            <span style="font-size: xx-large; border-radius: 4px; background-color: black; color: white; padding: 3px;">${otp}</span>
            <p style="color: black;">We will see you there.</p>
          </body>
        </html>`,
      attachments: [
        {
          filename: "logo.png",
          path: "assets/darkLogo.png",
          cid: "logo",
        }
      ]
    }

    await sendMail(mailOptions);
    
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const updateUsername = async (req, res) => {
  const { username } = req.body;
  const _id = req.user._id;
  
  try {
    await User.updateUser(username, _id);

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const changePassword = async (req, res) => {
  const { oldPass, newPass } = req.body;
  const _id = req.user._id;

  try {
    await User.change(oldPass, newPass, _id);

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const deleteUser = async (req, res) => {
  const password =  req.body.password;
  const _id = req.user._id;

  try {
    const user = await User.findById(_id);
    const match = await compare(password, user.password);

    if (!match) {
      throw new Error("Invalid password");
    }
    await User.findByIdAndDelete(_id);

    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
}

export const forgotPassword = async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not registered");
    }
    const token = jwt.sign({ _id: user._id }, process.env.FORGOT_SECRET, { expiresIn: "10m" });
    
    const mailOptions = {
      from: 'cinemaStack',
      to: email,
      subject: "Reset your password",
      html:
        `<html>
          <body style="background-color: white; font-family: Arial, sans-serif; padding: 20px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr bgcolor="black" style="height: 50px; color: white;">
                <td style="padding: 0 10px;"><img src="cid:logo" width="30" height="30" style="display: block;" /></td>
                <td><h1 style="font-family: monospace; margin: 0;">cinemaStack</h1></td>
              </tr>
            </table>
            <h1 style="color: black;">Reset your account password</h1>
            <p style="color: black;">Hey user, looks like you forgot your password. Don't worry. Use the link below to reset your password</p>
            <a href=${process.env.CLIENT_URL + "forgot/reset?token=" + token}><span style="font-size: xx-large; border-radius: 4px; background-color: black; color: white; padding: 3px;">Reset Password</span></a>
            <p style="color: black;">We will see you there.</p>
          </body>
        </html>`,
      attachments: [
        {
          filename: "logo.png",
          path: "assets/darkLogo.png",
          cid: "logo",
        }
      ]
    }

    await sendMail(mailOptions);

    res.status(200).json({ message: "Success" });
  } catch(error) {
    res.status(400).json({ error: error.message });
  }
}

export const updatePassword = async (req, res) => {

}