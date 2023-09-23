const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Get today tips
router.get("/get-token", (req, res, next) => {
  const cookie = req.query.cookie;
  if (!cookie)
    return res.status(403).send({
      message: "Bad request",
    });

    const accessToken = jwt.sign({ cookie }, process.env.SESSION_SECRET, {
        expiresIn: 86400 * 1  // 1 DAY
    });

    return res.status(200).json({
        data: { accessToken }
    })
});

module.exports = router;
