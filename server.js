import mongoose from "mongoose";
import { app } from "./app.js";
import dotenv from 'dotenv';
dotenv.config();


const { DB_URI, PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect(DB_URI)
  .then(() => {
      app.listen(PORT, () => {
        console.log("Server is running on port: ", PORT);
        console.log("Database connection successful.");
    });
})
.catch(({ message }) => {
    console.log(message);
    process.exit(1);
});