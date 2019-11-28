// Required libraries
var express = require("express");
var router = express.Router();

// Get the db instance
var db = require("../db");

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

// Get posts listing
router.get("/", function(req, res, next) {
  // Getting content from Mongo
  // Collection first

  db.get()
    .collection("posts")
    .find()
    .limit(100)
    .toArray()
    .then(function(data) {
      console.log(data);
      res.render("posts", { title: "Post List", post_list: data });
    })
    .catch(error => {
      console.log(error);
    });
  //Above is example of ES6 function def; it is functionally similar to the then function
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

    db.get()
      .collection("posts")
      .insertOne({ content: local_content, author: local_author })
      .then(function() {
        console.log("Inserted 1 object");
        res.redirect("/posts");
      })
      .catch(error => {
        console.log(error);
      });
  }
);

module.exports = router;
