const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/User.routes");
const { postRouter } = require("./routes/Post.routes");
const { authenticate } = require("./middleware/authenticate.middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("HOMEPAGE");
});

app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts", postRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log(error.message);
  }
  console.log(`running on post ${process.env.port}`);
});
