const router = require("express").Router();
const { Post, Comment, User } = require("../../models");
const sequelize = require("../../config/connection.js");
const withAuth = require("../../utils/auth");

// get all posts
router.get("/", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one post by ID
router.get("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
        },
        {
          model: Comment,
        },
      ],
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//create a post
router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      body: req.body.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json;
  }
});

// update a post
router.put("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.update(
      {
        title: req.body.title,
        body: req.body.body,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json;
  }
});

module.exports = router;
