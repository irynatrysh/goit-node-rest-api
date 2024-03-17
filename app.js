import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";

//const { PORT = 3000 } = process.env;
dotenv.config();

export const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

//app.listen(PORT, () => {
  //console.log(`Server is running. Use our API on port: ${PORT}`);
//});