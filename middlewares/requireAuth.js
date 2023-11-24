import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      throw new Error("Require authorization token");
    }
    const token = authorization.split(' ')[1];
    
    const { _id } = jwt.verify(token, process.env.USER_SECRET);

    req.user = await User.findById(_id).select('_id');
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export default requireAuth;