const bcrypt = require("bcryptjs");
const db = require("../db/index");

function comparePass(username, password) {
  console.log(username);
  return bcrypt.compareSync(username, password);
}

function createUser(req, res, next) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return db.one(
    "INSERT INTO users (user_id, username, password, email, fullname, location, travel_coverage) VALUES (DEFAULT, ${username}, ${password}, ${email}, ${fullname}, ${location}, ${travel_coverage}) RETURNING user_id",
    {
      username: req.body.username,
      password: hash,
      email: req.body.email,
      fullname: req.body.fullname,
      location: req.body.location,
      travel_coverage: req.body.travel_coverage
    }
  )
}

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ status: "Please log in" });
  }
  return next();
}


module.exports = {
  comparePass,
  createUser,
  loginRequired
};
