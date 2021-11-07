const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");


// create a comment
router.post("/", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      body: req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a comment
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
