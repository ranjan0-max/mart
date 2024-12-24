const Validators = require("../Validators");
const Response = require("../Helpers/response.helper");

module.exports = (validator) => {
  // ? verifying if the validator exists
  // eslint-disable-next-line no-prototype-builtins
  if (!Validators.hasOwnProperty(validator)) {
    throw new Error(`${validator} does not exist`);
  }

  // eslint-disable-next-line consistent-return
  return async (req, res, next) => {
    try {
      const validate = await Validators[validator].validateAsync(req.body);
      req.body = validate;
      next();
    } catch (error) {
      // eslint-disable-next-line max-len
      if (error.isJoi) {
        res.set("x-server-errortype", "InvalidRequestBodyException");
        return Response.badRequest(res, { message: error.message });
      }
      res.set("x-server-errortype", "InternalServerError");
      return Response.error(res, {
        status: 500,
        message: "Oops! Something went wrong",
      });
    }
  };
};
