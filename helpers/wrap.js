const wrapper = (body) => {
    const result = async (req, res, next) => {
  
      try {
        await body(req, res, next);
        
      } catch (error) {
        next(error);
      }
    };
    return result;
  };
  
  export default wrapper;