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
router.get('/userlikes/:user_id', db.getAllUserLikes);
router.get('/singleconcept/:concept_id', db.getSingleConcept);
router.get('/isfavorite/:concept_id', loginRequired, db.isFavorite);
router.get('/conceptskills/:concept_id', loginRequired, db.getSingleConceptSkills);
router.get('/comment/:concept_id', db.getConceptComments);
router.get('/getsinglecomment/:comment_id', loginRequired, db.getSingleComment);
router.get('/seenComments/:user_id', loginRequired, db.getSeenForCommentsByUserId);
router.get('/seenLikes/:user_id', loginRequired, db.getSeenForLikesByUserId);
router.get('/userconcept/:user_id', loginRequired, db.getUserConcept);
router.get('/accountOwnerPoints', loginRequired, db.getAccountOwnerPoints);
router.get('/allconcepts', loginRequired, db.getAllConcepts);
router.get('/user_skills', loginRequired, db.getUserSkills);
router.get('/seenCommentsByConcept_id/:concept_id', loginRequired, db.seenCommentsByConcept_id);

/*------------------------------POST Request------------------------------------*/
router.post('/login', db.loginUser);
router.post('/register', db.registerUser);
router.post('/addPoints', db.addPoints);
router.post('/addSkills', db.addSkills);
router.post('/createconcept', db.createConcept);
router.post('/conceptskills/:concept_id', loginRequired, db.conceptSkills);
router.post('/favorite', loginRequired, db.favoriteConcept);
router.post('/unfavorite', loginRequired, db.unfavoriteConcept);
router.post('/addComment', loginRequired, db.addConceptComment);

/*------------------------------PATCH Request------------------------------------*/
router.patch('/editComment/:comment_id', loginRequired, db.editConceptComment);
router.patch('/deleteConceptSkills', loginRequired, db.deleteConceptSkills);
router.patch('/deleteComments', loginRequired, db.deleteComments);
router.patch('/deleteLikes', loginRequired, db.deleteLikes);
router.patch('/deleteConcept', loginRequired, db.deleteConcept);
router.patch('/editconcept/:concept_id', loginRequired, db.editConcept);
router.patch('/editconceptskills/:concept_id', loginRequired, db.editConceptSkills);
router.patch('/seenCommentsChangeByConceptId/:concept_id', loginRequired, db.seenCommentsChangeByConceptId);
router.patch('/seenLikesChangeByUserId/:user_id', loginRequired, db.seenLikesChangeByUserId);



module.exports = router;
