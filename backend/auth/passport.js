const passport = require("passport");
const db = require("../db/index");

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log("serializeUser");
    done(null, user.user_id);
  });

  passport.deserializeUser((user_id, done) => {
    console.log("desirealize");
    db
      .one("SELECT * FROM users WHERE user_id=$1", [user_id])
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
};
