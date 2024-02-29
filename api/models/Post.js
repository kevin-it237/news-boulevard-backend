const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: false },
    title_en: { type: String, required: false },
    news_link: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, required: false },
    category: { type: String, required: false },
    category_en: { type: String, required: false },
    content_summary: { type: String, required: false },
    content_summary_en: { type: String, required: false },
    date: { type: String, required: false },
    datetime: { type: String, required: false },
    excerpt: { type: String, required: false },
    excerpt_en: { type: String, required: false },
    md_content: { type: String, required: false },
    md_content_en: { type: String, required: false },
    raw_html_content: { type: String, required: false },
    views: { type: Number, required: false },
    source: { type: String, required: false },
    updatedAt: { type: Date, required: false },
    createdAt: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

// Create a text index on the 'title' field
//PostSchema.index({ title: 'text', title_en: 'text' });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
