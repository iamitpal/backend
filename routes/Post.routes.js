const express = require("express");
const { PostModel } = require("../models/Post.model");
const postRouter = express.Router();
const jwt = require("jsonwebtoken");

postRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  try {
    const posts = await PostModel.find({ user: decoded.userID });
    res.send(posts);
  } catch (error) {
    console.log(error);
    console.log({ msg: "Something went wrong while getting your post" });
  }
});

postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const post = new PostModel(payload);
    await post.save();
    res.send({ msg: "Post Created" });
  } catch (error) {
    console.log(error);
    console.log({ msg: "Something went wrong while Posting your post" });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const postID = req.params.id;
  const Single_post = await PostModel.findOne({ _id: postID });
  const userID_in_post = Single_post.user;
  const current_userID = req.body.user;
  try {
    if (current_userID !== userID_in_post) {
      res.send({
        msg: "You are not authorized to delete/You are not the owner of this post",
      });
    } else {
      await PostModel.findByIdAndDelete({ _id: postID });
      res.send({ msg: `Post w/ id: ${postID} has been deleted` });
    }
  } catch (error) {
    console.log(error);
    res.send({ msg: `Something went wrong while deleting post` });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const postID = req.params.id;
  const Single_post = await PostModel.findOne({ _id: postID });
  const userID_in_post = Single_post.user;
  const current_userID = req.body.user;
  try {
    if (current_userID !== userID_in_post) {
      res.send({
        msg: "You are not authorized to Update/You are not the owner of this post",
      });
    } else {
      await PostModel.findByIdAndUpdate({ _id: postID }, payload);
      res.send({ msg: `Post w/ id: ${postID} has been Updated` });
    }
  } catch (error) {
    console.log(error);
    res.send({ msg: `Something went wrong while deleting post` });
  }
});

module.exports = {
  postRouter,
};
