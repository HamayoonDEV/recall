import Joi from "joi";
import Comment from "../models/comment.js";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const commentController = {
  //create comment
  async createComment(req, res, next) {
    const commentSchema = Joi.object({
      content: Joi.string().required(),
      creator: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
      blog: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = commentSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, author, blog, creator } = req.body;
    //saving to the database
    try {
      const newCommnet = new Comment({
        content,
        author,
        blog,
        creator,
      });
      await newCommnet.save();
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(201).json({ message: "comment has been created!" });
  },
  //get all comments
  async getComment(req, res, next) {
    const getCommentSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = getCommentSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      const comments = await Comment.find({ blog: id });
      const commentsArr = [];
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        commentsArr.push(comment);
      }
      return res.status(200).json({ comments: commentsArr });
    } catch (error) {
      return next(error);
    }
  },
};
export default commentController;
