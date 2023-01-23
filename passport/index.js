const passport = require("passport");
const local = require("./local"); // 로컬서버로 로그인할때
const google = require("./google"); // 구글서버로 로그인할때

const db = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    // db.User.findOne({ where: { user } })
    //   .then((user) => done(null, user))
    //   .catch((err) => done(err));
    done(null, user);
  });

  local();
  google(); // 구글 전략 등록
};
