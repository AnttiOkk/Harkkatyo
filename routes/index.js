var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  //console.log("Cookies: ", req.cookies);
  let user = cookieSplit(req.headers.cookie);
  let text = "Kirjautunut Sisään Käyttäjällä: " + user;

  let posts = req.app.get("poststore");
  let Users_post = posts.filter(posts => posts.author === user);

  res.render("index", {
    nameFromCookie: text,
    post_list: Users_post,
    User: user,
    title: "Twitter"
  });
  //console.log(user);
});

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
