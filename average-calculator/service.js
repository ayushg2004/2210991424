const axios = require("axios");
require("dotenv").config();

let window = [];

const maxWindowSize = 10;

const typeMap = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand",
};

let authToken = null;

const getAuthToken = async () => {
  if (authToken) return authToken;
  const response = await axios.post(
    "http://20.244.56.144/evaluation-service/auth",
    {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLLNO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }
  );
  authToken = response.data.access_token;
  return authToken;
};

const fetchNumbers = async (type) => {
  const url = `http://20.244.56.144/evaluation-service/${typeMap[type]}`;
  const token = await getAuthToken();

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 500, // ensure < 500ms response
    });
    return response.data.numbers || [];
  } catch (err) {
    console.log("Error or timeout:", err.message);
    return [];
  }
};

const handleRequest = async (req, res) => {
  const { type } = req.params;
  if (!typeMap[type]) return res.status(400).send({ error: "Invalid type" });

  const prevState = [...window];
  const fetched = await fetchNumbers(type);

  const newNumbers = fetched.filter((num) => !window.includes(num));

  window.push(...newNumbers);
  if (window.length > maxWindowSize) {
    window = window.slice(window.length - maxWindowSize);
  }

  const average = window.length
    ? (window.reduce((a, b) => a + b, 0) / window.length).toFixed(2)
    : 0;

  res.status(200).send({
    windowPrevState: prevState,
    windowCurrState: window,
    numbers: fetched,
    avg: parseFloat(average),
  });
};

module.exports = { handleRequest };
