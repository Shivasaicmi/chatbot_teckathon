import mongoose from "mongoose";
const { Schema } = mongoose;

const user_schema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  userEmail: {
    type: String,
    unique: true,
  },
  location: {
    type: String,
    default: "hyderabad",
  },
  role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },
});

export const UserModel = mongoose.model("Users", user_schema);
