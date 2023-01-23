const router = require("express").Router();
const db = require("../../models");
const localPassport = require("../../passport/local");
const googlePassport = require("../../passport/google");

router.post("/login", localPassport.authenticate("local"), (req, res) => {
  console.log(req);
  res.json(req.user);
});

// Route for signing up a user. The user's password is automatically
// hashed and stored securely thanks to how we configured our
// Sequelize User Model. If the user is created successfully, proceed
//  to log the user in, otherwise send back an error
router.post("/signup", (req, res) => {
  db.User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbResponse) => {
      res.json(dbResponse);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/user/google", function (req, res, next) {
  // GET /user/google
  console.log("[DEBUG]: get/ user/google");
  googlePassport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});

router.get(
  "/user/google/callback",
  googlePassport.authenticate("google", {
    failureRedirect: "/",
  }),
  async (req, res, next) => {
    return res.status(200).redirect(frontUrl);
  }
);

// Route for logging user out
router.get("/logout", (req, res) => {
  req.logout();
  res.json("logout successful");
});

// Route for getting some data about our user to be used client side
router.get("/user_data", (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  } else {
    // Otherwise send back the user's email and id
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  }
});

module.exports = router;
