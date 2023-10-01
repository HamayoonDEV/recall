import Joi from "joi";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import JwtServices from "../services/jwtService.js";
import RefreshToken from "../models/token.js";
const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
const authController = {
  //user register method
  async register(req, res, next) {
    const regeisterUserSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    const { error } = regeisterUserSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, name, email, password } = req.body;
    //password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    //handle username and email conflict
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });
      if (emailInUse) {
        const error = {
          status: 409,
          message: "email is alread in Use please use anOther email",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "username is not available please choose anOther username",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //save in database
    let user;
    try {
      const userToRegister = new User({
        username,
        name,
        email,
        password: hashedPassword,
      });
      user = await userToRegister.save();
    } catch (error) {
      return next(error);
    }
    //genrate Tokens
    const accessToken = JwtServices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwtServices.signRefreshToken({ _id: user._id }, "60m");
    //save to database
    await JwtServices.storeRefreshToken(user._id, refreshToken);
    //sending token to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.status(201).json({ user, auth: false });
  },
  //login method
  async login(req, res, next) {
    const loginUserSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, password } = req.body;
    let user;
    try {
      user = await User.findOne({ username });
      if (!user) {
        const error = {
          status: 401,
          message: "invalid username!",
        };
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = {
          status: 401,
          message: "invalid password!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //genrate tokens
    const accessToken = JwtServices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwtServices.signRefreshToken({ _id: user._id }, "60m");
    //update refreshToken to the database
    await RefreshToken.updateOne(
      { _id: user._id },
      { token: refreshToken },
      { upsert: true }
    );
    //sending tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    await res.status(200).json({ user, auth: false });
  },
  //logout method
  async logout(req, res, next) {
    const { refreshToken } = req.cookies;
    //delete refreshToken from cookies
    await RefreshToken.deleteOne({ token: refreshToken });
    //clearcookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ user: null, auth: false });
  },
  //refresh method
  async refresh(req, res, next) {
    const originalRefreshToken = req.cookies.refreshToken;
    //verify RefreshToken
    let id;
    try {
      id = await JwtServices.verifyRefreshToken(originalRefreshToken)._id;
    } catch (error) {
      const e = {
        status: 401,
        message: "unAuthorized!!",
      };
      return next(e);
    }
    let user;
    try {
      user = await RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });
      if (!user) {
        const error = {
          status: 401,
          message: "unAuthorized!!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //genrate new tokens
    const accessToken = JwtServices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwtServices.signRefreshToken({ _id: user._id }, "60m");
    //update refresh Token to the database
    try {
      await RefreshToken.updateOne({ _id: user._id }, { token: refreshToken });
    } catch (error) {
      return next(error);
    }
    //sending tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    const userRefreshed = await User.findOne({ _id: user._id });
    res.status(200).json({ userRefreshed, auth: true });
  },
};

export default authController;
