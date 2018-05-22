const passport = require("passport");
const db = require("../db/index");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  passport.deserializeUser((user_id, done) => {
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
