import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// const token = jwt.sign({_id : "784547056"}, process.env.FORGOT_SECRET, {expiresIn: "5s"});
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY2MzQxNDNhMGNkZmEyYmIwODg1YWQiLCJpYXQiOjE3MDExOTY4MzAsImV4cCI6MTcwMTIwNzYzMH0.GlHT5iiFEeez9dAacUXnAZzQS3kUcQ8x--0wSp60iRY"
const obj = jwt.verify(token, process.env.FORGOT_SECRET)

console.log(obj);