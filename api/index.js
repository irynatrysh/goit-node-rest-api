import isValidId from "../helpers/isValidId.js";

import mongooseError from "../helpers/mongooseError.js";
import validateBody from "../helpers/validateBody.js";

export const middlewares = {
  isValidId,
  mongooseError,
  validateBody,
};