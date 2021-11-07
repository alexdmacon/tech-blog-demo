const router = require("express").Router();
const { Post, Comment, User } = require("../models");
const withAuth = require("../utils/auth");

// getting posts to show on homepage
router.get("/", async (req, res) => {
  try {
    // including user(s) who wrote post(s)
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    // Serializing so handlebars can work with it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render with homepage handlebars file using the data we got and serialized above
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one post to show on its own page with comments
router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
        {
          model: Comment,
        },
      ],
    });

    // serializing data for handleabrs
    const post = postData.get({ plain: true });

    // passing data to 'post' template I still need to create. What is "..." doing here? I don't know yet. We'll see if it works.
    res.render("post", {
      ...post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // if/once user is logged in, redirect user to homepage
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  // else send the user to the 'login' page generated w/ handlebars template
  res.render("login");
});

module.exports = router;
