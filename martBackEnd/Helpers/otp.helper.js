const axios = require("axios");
const Logger = require("../Helpers/logger");
const controller = "otp.helper.js";

const { MSG_91_API_KEY, MSG_91_SENDER_ID } = process.env;

const sendOTPMsg91 = async (phoneNumber) => {
  const msg91Url = "https://api.msg91.com/api/v5/otp";

  try {
    const response = await axios.post(msg91Url, {
      authkey: MSG_91_API_KEY,
      mobile: phoneNumber,
      sender: MSG_91_SENDER_ID,
    });

    console.log("Msg91 Response:", response.data);
    return response.data;
  } catch (error) {
    Logger.error(error.message + "at sendOTPMsg91 function " + controller);
  }
};

const verifyOTPMsg91 = async (phoneNumber, otp) => {
  const msg91Url = "https://api.msg91.com/api/v5/otp/verify";

  try {
    const response = await axios.post(msg91Url, {
      authkey: MSG_91_API_KEY,
      mobile: phoneNumber,
      otp: otp,
    });

    console.log("Msg91 OTP Verification Response:", response.data);
    return response.data;
  } catch (error) {
    Logger.error(error.message + "at verifyOTPMsg91 function " + controller);
  }
};

module.exports = {
  verifyOTPMsg91,
  sendOTPMsg91,
};
