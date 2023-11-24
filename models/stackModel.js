import mongoose from "mongoose";

export const stackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  movies: {
    type: [Number],
    default: [],
  },
});