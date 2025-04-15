const axios = require("axios");
require("dotenv").config();

let cachedToken = null;

const fetchToken = async () => {
  if (cachedToken) return cachedToken;

  try {
    const response = await axios.post(process.env.AUTH_URL, {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLLNO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    const token = response.data.access_token;
    cachedToken = token;

    // Optionally set a timeout to invalidate cachedToken after expiry
    setTimeout(() => {
      cachedToken = null;
    }, 10 * 60 * 1000); // assume token valid for 10 min

    return token;
  } catch (err) {
    console.error("Error fetching token:", err.message);
    throw err;
  }
};

module.exports = { fetchToken };
