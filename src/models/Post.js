import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    thumbnailUrl: { type: String, trim: true },
    badge: { type: String, trim: true },
    likes: { type: Number, default: 0 },
    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // NEW
  },
  { timestamps: true }
);

// Text index for search
postSchema.index({ title: "text", content: "text" });

export const Post = mongoose.model("Post", postSchema);