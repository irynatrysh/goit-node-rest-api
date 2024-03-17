import express from "express";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../models/user.js";

import { validateBody, authorization, upload } from "../controllers/index.js";


import authControllers from "../controllers/authUser.js";

const { registerUser, login, logout, getCurrent, updateSubscription, updateAvatar } =
  authControllers;

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);

usersRouter.post("/login", validateBody(loginSchema), login);

usersRouter.get("/current", authorization, getCurrent);

usersRouter.post("/logout", authorization, logout);

usersRouter.patch("/",authorization,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

usersRouter.patch("/avatars", authorization,
  upload.single('avatar'),
  updateAvatar);


export default usersRouter;
