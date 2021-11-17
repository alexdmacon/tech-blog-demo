const router = require("express").Router();
const { Post, Comment, User } = require("../models");
const withAuth = require("../utils/auth");
const sequelize = require('../config/connection');


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

router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    console.log(
      '_______________________________________________________________________________________________________________' +
        'Logged in as' +
        req.session.user_id +
        req.session.logged_in
    );
    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to render new post template if user is logged in
router.get("/new-post", withAuth, (req, res) => {
  res.render("new-post");
});


module.exports = router;