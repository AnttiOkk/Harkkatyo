// Required libraries
var express = require("express");
var router = express.Router();

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

// Get posts listing
router.get("/", function(req, res, next) {
  // Retreiving the posts from the global var
  var authors_and_posts = req.app.get("poststore");

  let user = cookieSplit(req.headers.cookie);
  let text = "Kirjautunut sisään käyttäjällä: " + user;

  // Just send the array of objects to the browser
  res.render("posts", {
    nameFromCookie: text,
    User: user,
    title: "Post List",
    post_list: authors_and_posts.filter(posts => posts.author !== user)
  });
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
function cookieSplit(cookie) {
  if (cookie != null) {
    cookie = cookie.split("; ");
    for (let i = 0; i < cookie.length; i++) {
      let data = cookie[i];
      let Data = data.split("=");
      if (Data[0] === "user") {
        return Data[1];
      }
    }
  }
  return null;
}

module.exports = router;
