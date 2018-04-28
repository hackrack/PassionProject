var express = require('express');
var router = express.Router();
var db = require('../db/queries');
const { loginRequired } = require("../auth/helpers");

/*------------------------------GET Request------------------------------------*/
router.get("/sortedconceptsbylikes", db.sortedconceptsbylikes)


module.exports = router;
