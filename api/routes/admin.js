const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const admin = require("firebase-admin");

const Event = require("../models/Post");
const User = require("../models/User");
const chunkArray = require("../utils/utils");



// Delete an event
router.delete("/events/:id", (req, res, next) => {
  const id = req.params.id;
  Event.deleteOne({ _id: id })
    .exec()
    .then((events) => {
      return res.status(200).json({
        message: "Event deleted successfully",
        data: events,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Save users token for FCM notifications
router.post("/users/fcmtoken", async (req, res, next) => {
  const fcmtoken = req.body.fcmtoken;

  if (!fcmtoken)
    return res.status(400).send({
      message: "Token value is missing",
    });

  const tokenExist = await User.findOne({ fcmtoken });

  if (tokenExist) {
    return res.status(200).json({
      message: "User fcm token already exist",
    });
  }

  const user = new User({
    _id: mongoose.Types.ObjectId(),
    fcmtoken: fcmtoken,
  });
  user
    .save()
    .then((userToken) => {
      res.status(201).json({
        message: "User fcm token saved successfully",
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Send basic notification to all users
router.post("/users/notifications", async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;

  if (!title)
    return res.status(400).send({
      message: "Title is missing",
    });

  if (!description)
    return res.status(400).send({
      message: "Title is missing",
    });

  // get users fcm tokens
  const registrationres = await User.find({});
  const registrationTokens = registrationres.map((item) => item.fcmtoken);
  if (registrationTokens.length === 0) {
    return res.status(200).send({
      message: "No users tokens",
    });
  }

  // tokens list must not contain more than 500 items
  const promises = [];
  const chunks = chunkArray(registrationTokens, 500);

  chunks.forEach((chunk) => {
    const message = {
      notification: {
        title: title,
        body: description,
      },
      data: {
        title: title,
        body: description,
      },
      tokens: chunk,
    };
    promises.push(admin.messaging().sendMulticast(message));
  });

  await Promise.all(promises)
    .then((response) => {
      res.status(200).send({
        success: 1,
        data: response.map((result) => ({
          successCount: result.successCount + " messages were sent successfully",
          failureCount: result.failureCount + " messages failed",
        })),
      });
    })
    .catch((err) => {
      res.status(422).send({ success: 0, err });
    });
});

module.exports = router;
