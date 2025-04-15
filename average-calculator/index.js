const express = require("express");
const dotenv = require("dotenv");
const averageService = require("./service");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9876;

app.get("/numbers/:type", averageService.handleRequest);

app.listen(PORT, () => {
  console.log(`Average calculator running on http://localhost:${PORT}`);
});
