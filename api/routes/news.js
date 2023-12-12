const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/index");
const Post = require("../models/Post");

// Get news with pagination
router.get("/", authJwt.verifyToken, async (req, res, next) => {
  const category = req.query.category;
  const lang = req.query.lang;
  let query = { category };

  if (!lang)
    return res.status(403).json({
      message: "Lang is missing on query parameters",
    });

  if (!["fr", "en"].includes(lang))
    return res.status(403).json({
      message: "Language should be 'fr' or 'en",
    });

  let fields = "";
  if (lang === "fr") {
    fields =
      "title news_link image author category date datetime excerpt source";
  } else {
    fields =
      "title_en news_link image author category_en date datetime excerpt_en source";
    query = { category_en: category };
  }

  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 12;
  const result = {};
  let totalPosts = 0;
  if (category) {
    totalPosts = await Post.countDocuments(query).exec();
  } else {
    totalPosts = await Post.countDocuments().exec();
  }
  let startIndex = page * limit;
  const endIndex = (page + 1) * limit;
  result.totalPosts = totalPosts;

  // set the previous page in the response
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  // set the next page in the response
  if (endIndex < totalPosts) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }

  Post.find(category ? query : {})
    .select(fields)
    .skip(startIndex)
    // .sort([['_id', -1]])
    .sort({ datetime: -1 })
    .limit(limit)
    .exec()
    .then((posts) => {
      result.items = posts;
      return res.status(200).json({
        message: "Posts fetched successfully",
        data: result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get top 10 latest news with pagination
router.get("/latest", authJwt.verifyToken, (req, res, next) => {
  const lang = req.query.lang;

  if (!lang)
    return res.status(403).json({
      message: "Lang is missing on query parameters",
    });

  if (!["fr", "en"].includes(lang))
    return res.status(403).json({
      message: "Language should be 'fr' or 'en",
    });

  let fields = "";

  if (lang === "fr") {
    fields =
      "title news_link image author category date datetime excerpt source";
  } else {
    fields =
      "title_en news_link image author category_en date datetime excerpt_en source";
  }

  Post.find()
    .select(fields)
    .sort({ datetime: -1 })
    // .sort([['_id', -1]])
    .limit(10)
    .exec()
    .then((posts) => {
      if (posts.length === 0) {
        return res.status(404).json({
          message: "Posts not Found",
        });
      }

      return res.status(200).json({
        message: "Posts fetched successfully",
        data: posts,
      });
    })
    .catch((err) => {
      console.log({ err });
      return res.status(500).json({ error: err });
    });
});

// Get post by id
router.get("/:id", authJwt.verifyToken, async (req, res, next) => {
  const lang = req.query.lang;
  const id = req.params.id;

  if (!lang)
    return res.status(403).json({
      message: "Lang is missing on query parameters",
    });

  if (!["fr", "en"].includes(lang))
    return res.status(403).json({
      message: "Language should be 'fr' or 'en",
    });

  // return english and french version
  let fields =
    "title title_en news_link image author category_en category content_summary content_summary_en date datetime excerpt excerpt_en md_content md_content_en source updatedAt createdAt";

  Post.findById(id)
    .select(fields)
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "Posts does not exist",
        });
      }

      return res.status(200).json({
        message: "Post fetched successfully",
        data: post,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get news
router.post("/search", authJwt.verifyToken, async (req, res, next) => {
  const lang = req.query.lang;
  const queryData = req.body.query;

  if (!lang)
    return res.status(403).json({
      message: "Lang is missing on query parameters",
    });

  if (!queryData)
    return res.status(403).json({
      message: "Query value is missing.",
    });

  if (!["fr", "en"].includes(lang))
    return res.status(403).json({
      message: "Language should be 'fr' or 'en",
    });

  let fields = "";
  if (lang === "fr") {
    fields =
      "title news_link image author category date datetime excerpt source";
  } else {
    fields =
      "title_en news_link image author category_en date datetime excerpt_en source";
  }

  let query = { $text: { $search: `"\"${queryData}\"` } }; // for phrase search
  if (queryData && queryData.split(" ").length === 1) {
    query = { $text: { $search: queryData } }; // for single word search
  }

  await Post.find(query)
    .select(fields)
    .limit(10)
    .exec((err, posts) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      return res.status(200).json({
        message: "Posts fetched successfully",
        data: posts,
      });
    });
});

module.exports = router;
