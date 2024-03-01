import { app } from "../app.js";
import mongoose from "mongoose";

const DB_URI = `mongodb+srv://irishatrysh:9joPzljOk46ru6vV@cluster0.aztrr0p.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0`;

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error; // Додано обробку помилок.
  }
};
