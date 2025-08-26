import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

commentSchema.index({ post: 1, author: 1 }, { unique: true });

export const Comment = mongoose.model("Comment", commentSchema);