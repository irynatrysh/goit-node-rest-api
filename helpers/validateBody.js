import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  const valid = (req, _, next) => {

    const { error } = schema.validate(req.body);
  
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return valid;
};

export default validateBody;