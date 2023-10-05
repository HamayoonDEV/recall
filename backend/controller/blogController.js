import Joi from "joi";
import fs from "fs";
import Blog from "../models/blog.js";
import { BACKEND_SERVER_PATH } from "../config/index.js";
import Comment from "../models/comment.js";
import BlogDto from "../Dto/BlogDto.js";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const blogController = {
  //create blog method
  async createBlog(req, res, next) {
    const createBlogSchema = Joi.object({
      content: Joi.string().required(),
      title: Joi.string().required(),
      photopath: Joi.string().required(),
      author: Joi.string().required(),
    });
    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, author } = req.body;
    //save in buffer
    const buffer = Buffer.from(
      photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    //allocate random name
    const imagePath = `${Date.now()}-${author}.png`;
    //store locally
    fs.writeFileSync(`storage/${imagePath}`, buffer);
    //store in data base
    let blog;
    try {
      const newBlog = new Blog({
        content,
        title,
        author,
        photopath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      });
      blog = await newBlog.save();
    } catch (error) {
      return next(error);
    }
    res.status(201).json({ blog });
  },
  //get all blog
  async getAll(req, res, next) {
    //get all blogs
    try {
      const blogs = await Blog.find({}).populate("author");
      const blogArr = [];
      for (let i = 0; i < blogs.length; i++) {
        const blog = new BlogDto(blogs[i]);
        blogArr.push(blog);
      }
      return res.status(200).json({ blogs: blogArr });
    } catch (error) {
      return next(error);
    }
  },
  //get blog by id method
  async getBlogById(req, res, next) {
    const getBlogByIdSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = getBlogByIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let blog;
    try {
      blog = await Blog.findOne({ _id: id }).populate("author");
      if (!blog) {
        const error = {
          status: 404,
          message: "not Found!!!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    const blogDto = new BlogDto(blog);
    //sending response
    res.status(200).json({ blog: blogDto });
  },
  //update blog method
  async updateBlog(req, res, next) {
    const updateSchema = Joi.object({
      content: Joi.string(),
      title: Joi.string(),
      photopath: Joi.string(),
      author: Joi.string().regex(mongoIdPattern).required(),
      blogId: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, author, blogId } = req.body;
    try {
      const blog = await Blog.findOne({ _id: blogId });
      if (photopath) {
        let previous = blog.photopath;
        previous = previous.split("/").at(-1);
        fs.unlinkSync(`storage/${previous}`);
        //save in buffer
        const buffer = Buffer.from(
          photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          "base64"
        );
        //allocate random name
        const imagePath = `${Date.now()}-${author}.png`;
        //store locally
        fs.writeFileSync(`storage/${imagePath}`, buffer);
        //update database
        try {
          await Blog.updateOne(
            { _id: blogId },
            {
              content,
              title,
              photopath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
            }
          );
        } catch (error) {
          return next(error);
        }
      } else {
        try {
          await Blog.updateOne({ _id: blogId }, { content, title });
        } catch (error) {
          return next(error);
        }
      }
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "blog has been updated!!" });
  },
  //delete blog method
  async deleteBlog(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = deleteSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      await Blog.deleteOne({ _id: id });
      await Comment.deleteMany({});
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "blog has been deleted!" });
  },
};

export default blogController;
