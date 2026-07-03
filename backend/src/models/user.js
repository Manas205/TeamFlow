// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, 
    },
    isVerified: {
      type: Boolean,
      default: true, 
    },
    refreshToken: {
      type: String,
      default: null,
      select: false, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('User', userSchema);