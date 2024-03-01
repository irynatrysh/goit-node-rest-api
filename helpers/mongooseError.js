const mongooseError = (error, _, next) => {
    error.status = 400;
    next();
}

export default mongooseError;