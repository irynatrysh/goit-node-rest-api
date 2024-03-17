import { Schema, model } from "mongoose";
import Joi from "joi";

import { mongoError } from "../controllers/index.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", mongoError);

export const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.only":
      "Invalid subscription type. Allowed values are: starter, pro, business",
  }),
});

export const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.only":
      "Invalid subscription type. Allowed values are: starter, pro, business",
  }),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.required": "Subscription is required",
      "any.only": "Subscription has only 3 values: starter, pro, business",
    }),
});


export const User = model("user", userSchema);

