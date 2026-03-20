const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "full name is required"],
      minlength: [3, "name at least 3 characters"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email"]
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "password at least 8 characters"]
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
      trim: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      trim: true,
    },
    worngAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: true
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;