var express = require('express');
var router = express.Router();
var db = require('../db/queries');
const { loginRequired } = require("../auth/helpers");

/*------------------------------GET Request------------------------------------*/
router.get('/logout', loginRequired, db.logoutUser);
router.get('/sortedconceptsbylikes', db.sortedconceptsbylikes);
router.get('/', loginRequired, db.getUser);
router.get('/profile/:user_id', db.getSingleUser);
router.get('/profile/skills/:user_id', db.getSingleUserSkills);
/*------------------------------POST Request------------------------------------*/
router.post('/login', db.loginUser);
router.post('/register', db.registerUser);
router.post('/addPoints', db.addPoints);
router.post('/addSkills', db.addSkills);

module.exports = router;
