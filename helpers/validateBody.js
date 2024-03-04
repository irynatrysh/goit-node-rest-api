import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  const valid = (req, _, next) => {
    const result = Object.keys(req.body).length;

    const { error } = schema.validate(req.body);
    
    if (!result) {
      next(HttpError(400, "Body must have at least one field"));
  }

    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return valid;
};

export default validateBody;