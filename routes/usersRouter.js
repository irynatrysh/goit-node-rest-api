import express from "express";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../models/user.js";

import { validateBody, authorization, upload } from "../controllers/index.js";

import authControllers from "../controllers/authUser.js";// змінено шлях до імпорту

 
const { registerUser, login, logout, getCurrent, updateSubscription, updateAvatar, verifyUser } =
  authControllers;

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);

usersRouter.post("/login", validateBody(loginSchema), login);

usersRouter.post("/logout", authorization, logout);

usersRouter.get("/current", authorization, getCurrent);


usersRouter.patch("/",authorization,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

usersRouter.patch("/avatars", authorization,
  upload.single('avatar'),
  updateAvatar);

usersRouter.get("/verify/:token", verifyUser); //  verifyUser should be with authControllers

export default usersRouter ;
