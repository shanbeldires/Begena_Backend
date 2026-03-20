const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const RefreshToken = require("../models/refreshToken.js")
const userValidation = require("../middleware/user.js")
const {
  ACCESS_TOKEN_EXPIRE_DATE,
  REFRESH_TOKEN_EXPIRE_DATE,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY
} = require("../config/env");

const cookieOption = {
  sameSite: "lax",
  httpOnly: true,
  secure: false
};

const signUp = async (req, res, next) => {
  try {
    const { full_name, email, password, phone, address,role} = req.body;
    const { error } = userValidation.validate(req.body);

    if (error) {
      const error = new Error("invalid input");
      error.statusCode = 400;
      throw error;
    }

    if (!full_name || !email || !password || !phone || !address) {
      const error = new Error("all information is  required");
      error.statusCode = 400;
      throw error;
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      const error = new Error("user has already exist");
      error.statusCode = 409;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error("password is not strong");
      error.statusCode = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      full_name,
      email,
      phone,
      address,
      role:role || "user",
      password: hashedPassword
    });

    const accessToken = jwt.sign(
      { user_id: newUser._id },
      ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRE_DATE }
    );

    const refreshToken = jwt.sign(
      { user_id: newUser._id },
      REFRESH_TOKEN_PRIVATE_KEY,
      { algorithm: "HS256", expiresIn: REFRESH_TOKEN_EXPIRE_DATE }
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      ...cookieOption
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...cookieOption
    });

    const hashedRefreshToken = await crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    let expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 90);

    await RefreshToken.findOneAndUpdate(
      {user_id: newUser._id},
      {refreshToken: hashedRefreshToken,expires_at},
      {upsert: true ,
      new: true }
    );
    
    const userObject = newUser.toObject();
    delete userObject.password;

    res.status(201).json({
      message: "successfuly signup",
      success: true,
      data: {
        accessToken,
        refreshToken,
        userObject
      }
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      const error = new Error("email,password required");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error("password is not strong");
      error.statusCode = 401;
      throw error;
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (user.lockUntil && user.lockUntil > new Date()) {
      const error = new Error("your account is blocked try again later");
      error.statusCode = 403;
      throw error;
    }

    if (!isCorrectPassword) {
      user.worngAttempts = (user.worngAttempts || 0) + 1;
      if (user.worngAttempts > 5) {
        user.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        const error = new Error("invalid credential");
        error.statusCode = 401;
        throw error;
      }
      await user.save();
      const error = new Error("invalid credential");
      error.statusCode = 401;
      throw error;
    }

    user.worngAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const accessToken = jwt.sign(
      { user_id: user._id },
      ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRE_DATE }
    );

    const refreshToken = jwt.sign(
      { user_id: user._id },
      REFRESH_TOKEN_PRIVATE_KEY,
      { algorithm: "HS256", expiresIn: REFRESH_TOKEN_EXPIRE_DATE }
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      ...cookieOption
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...cookieOption
    });

    const hashedRefreshToken = await crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    let expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 90);

    await RefreshToken.findOneAndUpdate(
      {user_id: user._id},
      {refreshToken: hashedRefreshToken,expires_at},
      {upsert: true, 
      new: true }
    );

    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({
      message: "successfuly signin",
      success: true,
      data: {
        accessToken,
        refreshToken,
        userObject
      }
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      const hashedRefreshToken = await crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
      await RefreshToken.findOneAndDelete({ refreshToken: hashedRefreshToken });
    }

    res.clearCookie("accessToken", {
      ...cookieOption
    });

    res.clearCookie("refreshToken", {
      ...cookieOption
    });
    res.status(201).json({
      message: "successfuly log out",
      success: true
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      const error = new Error("token missing");
      error.statusCode = 401;
      throw error;
    }

    const hashedRefreshToken = await crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const token = await RefreshToken.findOne({
      refreshToken: hashedRefreshToken
    });

    if (!token) {
      const error = new Error("unautherized");
      error.statusCode = 401;
      throw error;
    }

    const decode = jwt.verify(refreshToken, REFRESH_TOKEN_PUBLIC_KEY);
    const accessToken = jwt.sign(
      { user_id: decode.user_id },
      ACCESS_TOKEN_PRIVATE_KEY,
      { algorithm: "HS256", expiresIn: ACCESS_TOKEN_EXPIRE_DATE }
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      ...cookieOption
    });

    res.status(201).json({
      message: "access token produced",
      success: true,
      accessToken
    });
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) {
      const error = new Error("unautherized");
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
module .exports = {
  signUp,
  signIn,
  signOut,
  refreshToken,
  getUser
};