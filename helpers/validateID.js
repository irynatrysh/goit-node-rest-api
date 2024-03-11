import { isValidObjectId } from "mongoose";

import HttpError from "./HttpError.js";

const validateID = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpError(404, "Not found"));
  }
  next();
};

export default validateID;