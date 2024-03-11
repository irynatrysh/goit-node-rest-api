import express from "express";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../models/user.js";

import { validateBody, authorization } from "../controllers/index.js";

import authControllers from "../controllers/authUser.js";

const { registerUser, login, logout, getCurrent, updateSubscription } =
  authControllers;

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);

usersRouter.post("/login", validateBody(loginSchema), login);

usersRouter.get("/current", authorization, getCurrent);

usersRouter.post("/logout", authorization, logout);

usersRouter.patch(
  "/",
  authorization,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

export default usersRouter;
