const router = require("express").Router();
const { Post, Comment, User } = require("../models");
const withAuth = require("../utils/auth");
const sequelize = require('../config/connection');


router.get("/", withAuth, async (req, res) => {
    try {
      const postData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ["name"],
          },
          {
              model: Comment,
              include: {
                  model: User,
                  attributes: ["name"],
              }
          }
        ],
      });
  
      const posts = postData.map((post) => post.get({ plain: true }));
  
      res.render("dashboard", {
        posts,
        logged_in: req.session.logged_in,
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
