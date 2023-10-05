import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    authror: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    blog: { type: mongoose.SchemaTypes.ObjectId, ref: "Blog" },
    creator: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Comment", commentSchema, "comments");
