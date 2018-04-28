const db = require("./index");
const authHelpers = require("../auth/helpers");
const passport = require("../auth/local");

function sortedconceptsbylikes(req, res, next) {
  db.any(
  `SELECT q.*,  COUNT(l.concept_id) AS bulbs
   FROM (
      SELECT concepts.*, username, fullname,
      string_agg(DISTINCT concept_skill, ', ') AS skillsSortedById
      FROM concepts
      INNER JOIN concept_skills ON (concepts.concept_id=concept_skills.concept_id)
      INNER JOIN users ON (concepts.user_id=users.user_id)
      GROUP BY concept_skills.concept_id, concepts.concept_id, users.username, users.fullname
    ) q, likes l
    WHERE q.concept_id = l.concept_id
    GROUP BY q.concept_id, q.skillsSortedById, q.concept_name,
      q.description, q.platform, q.is_remote, q.concept_timestamp,
      q.user_id, q.location, q.username, q.fullname
    ORDER BY bulbs desc;`
)
.then(data => {
  res.json(data);
})
.catch(error => {
  res.json(error);
});
}

module.exports = {
  sortedconceptsbylikes,
}
