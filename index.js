const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
// const { MongoClient } = require("mongodb");
// const ObjectId = require("mongodb").ObjectId;
// import token from "./world-design-official-firebase-adminsdk.json";

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Designers world!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
