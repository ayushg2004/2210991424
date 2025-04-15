require("dotenv").config();
const express = require("express");
const app = express();
const controller = require("./controller");

app.get("/analyze/:userId", controller.analyzeUser);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Social Analytics service running on port ${PORT}`);
});
