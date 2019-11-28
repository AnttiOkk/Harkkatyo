// Required libraries
var express = require("express");
var router = express.Router();

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

// Get posts listing
router.get("/", function(req, res, next) {
  // Retreiving the posts from the global var
  var authors_and_posts = req.app.get("poststore");

  // Just send the array of objects to the browser
  res.render("posts", { title: "Post List", post_list: authors_and_posts });
});

// Sanitation middleware
// See https://express-validator.github.io/docs/sanitization-chain-api.html
// And https://express-validator.github.io/docs/filter-api.html
router.post(
  "/create",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    var local_content = req.body.content;
    var local_author = req.body.author;
    console.log("We got content: " + local_content);
    console.log("from author: " + local_author);

    req.app.get("poststore").push({
      author: local_author,
      content: local_content
    });

    res.redirect("/posts");
  }
);

module.exports = router;
