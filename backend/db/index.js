var pgp = require("pg-promise")({});
var connectionString = "postgres://localhost/database";
var db = pgp(connectionString);

module.exports = db;
