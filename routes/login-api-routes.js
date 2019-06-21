// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  
  app.post("/api/login", passport.authenticate("local", {failureMessage: "Incorrect username or password"}), function(req, res) {
   
    console.log("hi")
    console.log(req.user);
    res.json(req.user.id);
  });
 
  app.post("/api/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }).then(function (data) {
      // console.log(data);
      res.redirect(307, "/api/login");
      // res.json(data.id);
    }).catch(function (err) {
      // console.log(err);
      // res.json(err);
      res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      console.log(req.user)
      res.json({

        email: req.user.email,
        id: req.user.id,
        name: req.user.name
      });
    }
  });

};