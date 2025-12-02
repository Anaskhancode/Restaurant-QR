import express from "express";
import dbConnect from "./config/database.js";

const app = express();

dbConnect();

app.get("/", (req, res) => {
  res.send("Hello from Express using import!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});