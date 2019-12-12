// Required libraries
var express = require("express");
var router = express.Router();

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

// Get posts listing
router.get("/", function(req, res, next) {
  // Retreiving the posts from the global var
  var username_and_password = req.app.get("userstore");

  let user = cookieSplit(req.headers.cookie);
  let text = "Kirjautunut sisään käyttäjällä: " + user;

  // Just send the array of objects to the browser
  res.render("register", {
    nameFromCookie: text,
    User: user,
    title: "Register List",
    register_list: username_and_password
  });
});
// Sanitation middleware
// See https://express-validator.github.io/docs/sanitization-chain-api.html
// And https://express-validator.github.io/docs/filter-api.html
router.post(
  "/login",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    // Call userstore
    var userStore = req.app.get("userstore");

    var local_password = req.body.password;
    var local_username = req.body.username;
    console.log("We got password: " + local_password);
    console.log("from user: " + local_username);

    if (testLogin(local_username, local_password, userStore)) {
      res.cookie("user", local_username);
      res.redirect("/");
    } else {
      res.redirect("/register");
    }

    // Check if the username and password goes to userStore
    //console.log(userStore);
  }
);

router.post(
  "/register",
  sanitizeBody("*")
    .trim()
    .escape(),
  function(req, res, next) {
    // Call userstore
    var userStore = req.app.get("userstore");

    var local_password = req.body.password;
    var local_username = req.body.username;
    console.log("We got password: " + local_password);
    console.log("from user: " + local_username);

    if (testRegistration(local_username, userStore)) {
      req.app.get("userstore").push({
        username: local_username,
        password: local_password
      });
      // If name is valid it will stays register page
      res.redirect("/register");
    } else {
      // if not it will redirect to home page
      res.redirect("/");
    }

    // Check if the username and password goes to userStore
    //console.log(userStore);
  }
);

// test that Login matches with the info that is in userStore
function testLogin(username, password, userStore) {
  for (let i = 0; i < userStore.length; i++) {
    console.log(userStore[i]);
    if (username === userStore[i].username) {
      if (password === userStore[i].password) {
        console.log("toimii");
        return true;
      }
    }
  }
  return false;
}
// test that given username doesnt excist in the userstore
function testRegistration(username, userStore) {
  for (let i = 0; i < userStore.length; i++) {
    console.log(userStore[i]);
    if (username === userStore[i].username) {
      return false;
    }
  }
  return true;
}
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
