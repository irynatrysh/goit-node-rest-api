//authUser.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import crypto from "node:crypto";

import HttpError from "../helpers/HttpError.js";
import wrapper from "../helpers/wrap.js";

import { User } from "../models/user.js";

import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import gravatar from "gravatar";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { SECRET_KEY } = process.env;


const avatarDir = path.resolve("public", "avatars");

//REGISTER USER

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomUUID();

 console.log(verifyToken);

  const msg = {
  to: 'irisha.trysh@gmail.com',
  from: 'irisha.trysh@gmail.com',
  subject: 'Welcome to contacts',
  text: `To confirm your registration please click on the <a href="http://localhost:3000/users/register/verify/${verifyToken}">link</a>`,
  html: `To confirm your registration please open the link <a href="http://localhost:3000/users/register/verify/${verifyToken}">link</a>`,
  };
//not sure about link maybe it's should be - user/verify/token, when im change link - my message send seccessfully

//AVATAR

  const avatarURL = gravatar.url(email);

//CREATE USER

  const newUser = await User.create({
    ...req.body,
    password: hashPassword, avatarURL, verifyToken
  });
  const { email: userEmail, subscription } = newUser;


  //send EMail
  sgMail.send(msg)
  .then(() => console.log('Email sent successfully'))
  .catch((error) => console.error(error));


  res.status(201).json({
    user: {
      email: userEmail,
      subscription ,
    },
  });
};


//LOGIN

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Your account is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "18h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: { email, subscription: user.subscription },
  });
};


//GET CURRENT

const getCurrent = async(req, res)=> {
    const { email, subscription } = req.user;

    res.json({
        email, subscription,
    })
}

//UPDATE SUBSCRIPTION

const updateSubscription = async (req, res) => {
    const { subscription } = req.body;
    const { _id } = req.user;
  
    const updatedUserSubscription = await User.findByIdAndUpdate(
      _id,
      {
        subscription,
      }
    );
    res.json(updatedUserSubscription);
  };
  
  // LOGOUT

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({message: "Logout success"})
};

// AVATAR UPDATE

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const userUpdateAvatar = await User.findById(_id);

  if (!userUpdateAvatar) {
    throw HttpError(401, "Unauthorized");
  }

  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.resolve(avatarDir, filename);

  const image = await Jimp.read(tempUpload);
  image.resize(250, 250).write(tempUpload);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = `/avatars/${filename}`;

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
}

//VERIFYUser

async function verifyUser (req, res, next) {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verifyToken: token });
    
    if (!user)
      return res.status(404).send({ message: "Not found" });

 if (user.verify) {
      return res.status(400).send({ message: "Email already verified" });
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verifyToken:null });
  
  res.send({message: "Email confirm successfully"});
  } catch (error) {
    next(error);
  }
}

// RESEND VERIFICATION EMAIL
async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;
    const verifyToken = crypto.randomUUID(); 
    const msg = {
      to: email,
      from: 'irisha.trysh@gmail.com',
      subject: 'Welcome to contacts',
      text: `To confirm your registration please click on the <a href="http://localhost:3000/users/register/verify/${verifyToken}">link</a>`,
      html: `To confirm your registration please open the link <a href="http://localhost:3000/users/register/verify/${verifyToken}">link</a>`,
    };

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Перевірте, чи користувач вже підтвердив свою електронну пошту
    if (user.verify) {
      return res.status(400).json({ message: "Email already verified" });
    }

    await sgMail.send(msg);
  //console.log("Verification email sent successfully.");
    
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}



export default {
  registerUser: wrapper(registerUser),
  login: wrapper(login),
  getCurrent: wrapper(getCurrent),
  updateSubscription: wrapper(updateSubscription),
  logout: wrapper(logout),
  updateAvatar: wrapper(updateAvatar),
  verifyUser: wrapper(verifyUser), // add function verifyUser to export
  resendVerificationEmail: wrapper(resendVerificationEmail), //add one more medhod to export 
};
