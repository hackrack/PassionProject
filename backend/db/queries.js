const db = require("./index");
const authHelpers = require("../auth/helpers");
const passport = require("../auth/local");

/*-------------------------------GET Request----------------------------------*/
function logoutUser(req, res, next) {
  req.logout();
  res.status(200).send("log out success");
}

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

function getUser(req, res, next) {
  db
    .any(
      `SELECT user_id, username, email, fullname, user_img, travel_coverage, location
       FROM users
       WHERE user_id=$1`,
      [req.user.user_id]
    )
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json(error);
    });
}

function getSingleUserSkills(req, res, next) {
  console.log("getSingleUserSkills");
  db
    .any(
      `SELECT user_skill
       FROM user_skills
       WHERE user_id=$1`,
      [req.params.user_id]
    )
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json(error);
    });
}

function getSingleUser(req, res, next) {
  console.log("get sibgle user");
  db
  .any(
    `SELECT user_id, username, email, fullname, user_img, travel_coverage, location
     FROM users
     WHERE user_id=$1`,
    [req.params.user_id]
  )
  .then(data => {
    res.json(data);
  })
  .catch(error => {
    res.json(error);
  });
}

function getAllUserLikes(req, res, next) {
  return db
    .any(
      `SELECT *
       FROM concepts
       WHERE concept_id IN (
       SELECT concept_id
       FROM likes
       WHERE user_id=$1)`,
       [req.params.user_id]
     )
     .then(data => {
       res.json(data);
     })
     .catch(error => {
       res.json(error);
     });
}

function getSingleConcept(req, res, next) {
  return db.any(
      `SELECT COUNT(likes.concept_id) AS
       favorites_count, USERname, users.user_id, concept_name,
       description, concepts.location, is_remote,concept_timestamp
       FROM concepts
       LEFT JOIN USERs ON (concepts.user_id=users.user_id)
       LEFT JOIN likes ON (likes.concept_id=concepts.concept_id)
       WHERE concepts.concept_id=${req.params.concept_id}
       GROUP BY concepts.concept_id, users.username, users.user_id;`
    )
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(error => {
      res.json(error);
    });
}

function isFavorite(req, res, next) {
   db.any(
      `SELECT *
          FROM likes
          WHERE user_id=${req.user.user_id}
          AND concept_id=${req.params.concept_id};`
    )
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json(error);
    });
}

function getSingleConceptSkills(req, res, next) {
  return db
    .any(`
      SELECT concept_skill
      FROM concept_skills
      WHERE concept_id=${req.params.concept_id};`)
    .then( (data) => {
      res.json(data);
    })
    .catch( (err) => {
      console.log(err);
    })
}

/*-------------------------------POST Request----------------------------------*/
function registerUser(req, res, next) {
  return authHelpers
    .createUser(req)
    .then(response => {
      passport.authenticate("local", (err, user, info) => {
        console.log("user", user);
        if (user) {
          res.status(200).json({
            status: "success",
            data: user,
            message: "Registered one user"
          });
        }
      })(req, res, next);
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        detail: err.detail
      });
    });
}

function getLastUniqueIds(array) {
  let sortedById = [];
  let sortedByObj = [];
  for (let i = array.length -1; i >= 0; i--) {
    let ele = array[i];
    if (sortedById.includes(ele.id) === false) {
      sortedById.push(ele.id);
      sortedByObj.push(ele)
    }
  }
  return sortedByObj;
}

function checkArrLength(array) {
  var arr = [...array];
  for (let i = 1; i <= 15; i++) {
    if (array[i] === undefined) {
      arr = [...arr, {id: i, q: 0}];
    }
  }
  return arr;
}

function zeroSetter(array) {
  for (var i = 0; i < array.length; i++) {
    var ele = array[i];
    if (ele.q === "") {
      ele.q = 0;
    }
  }
  return array;
}

function addPoints(req, res, next) {
  let points = getLastUniqueIds(req.body.points);
  let points2 = points.length !== 15? checkArrLength(points): points;
  let fullySorted = [];
  fullySorted = points2.sort( (a ,b) => {
    return a.id - b.id;
  })
  var setToZero = zeroSetter(fullySorted)
  return db.none(
    'INSERT INTO questionnary' +
            '(user_id, question_1, question_2, question_3,' +
            'question_4, question_5, question_6, question_7,' +
            'question_8, question_9, question_10, question_11,' +
            'question_12, question_13, question_14, question_15)' +
            'VALUES (${user_id}, ${question_1}, ${question_2}, ${question_3},' +
            '${question_4},${question_5},${question_6},${question_7},' +
            '${question_8},${question_9},${question_10},${question_11}, ' +
            '${question_12},${question_13},${question_14},${question_15})',
    {
      user_id: req.body.user_id,
      question_1: fullySorted[0].q,
      question_2: fullySorted[1].q,
      question_3: fullySorted[2].q,
      question_4: fullySorted[3].q,
      question_5: fullySorted[4].q,
      question_6: fullySorted[5].q,
      question_7: fullySorted[6].q,
      question_8: fullySorted[7].q,
      question_9: fullySorted[8].q,
      question_10: fullySorted[9].q,
      question_11: fullySorted[10].q,
      question_12: fullySorted[11].q,
      question_13: fullySorted[12].q,
      question_14: fullySorted[13].q,
      question_15: fullySorted[14].q
    }
  )
  .then(data => {
    res.json("success");
  })
  .catch(error => {
    res.json(error);
  });
}

function addSkills(req, res, next) {
  return db
    .task(t => {
      const skills = req.body.skills;
      const queries = skills.map(skill => {
        return t.none(
          "INSERT INTO user_skills (user_id, user_skill) " +
            " VALUES (${user_id}, ${user_skill})",
          {
            user_id: req.body.user_id,
            user_skill: skill.name
          }
        );
      });
      return t.batch(queries);
    })
    .then(data => {
      res.json("success");
    })
    .catch(error => {
      res.json(error);
    });
}

function loginUser(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      res.status(500).send("error while trying to log in");
    } else if (!user) {
      res.status(401).send("invalid username/password");
    } else if (user) {
      req.logIn(user, function(err) {
        if (err) {
          res.status(500).send("error");
        } else {
          res.status(200).send(user);
        }
      });
    }
  })(req, res, next);
}

function createConcept(req, res, next) {
  return db.one(
    'INSERT INTO ' +
    'concepts (concept_id, user_id, concept_name, description, is_remote, location) ' +
    'VALUES (DEFAULT, ${user_id}, ${concept_name}, ${description}, ${is_remote}, ${location}) ' +
    'RETURNING concept_id ',
    {
      user_id: req.user.user_id,
      concept_name: req.body.concept_name,
      description: req.body.description,
      is_remote: req.body.is_remote,
      location: req.body.location
    })
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.json(error);
    });
}

function conceptSkills(req, res, next) {
  return db
    .task(t => {
      const skills = req.body.skills;
      const queries = skills.map(skill => {
        return t.none(
          "INSERT INTO concept_skills (concept_id, concept_skill) " +
          "VALUES (${concept_id}, ${concept_skill})",
          {
            concept_id: req.params.concept_id,
            concept_skill: skill.name
          }
        );
      });
      return t.batch(queries);
    })
    .then(data => {
      res.json("success");
    })
    .catch(error => {
      res.json(error);
    });
}

function favoriteConcept(req, res, next) {
  return db
    .none(
      "INSERT INTO likes (concept_id, user_id, seen) VALUES (${concept_id}, ${user_id}, ${seen});",
      {
        concept_id: req.body.concept_id,
        user_id: req.user.user_id,
        seen: req.body.seen
      }
    )
    .then(data => {
      res.json("success");
    })
    .catch(error => {
      res.json(error);
    });
}

function unfavoriteConcept(req, res, next) {
  return db
    .none(
      `DELETE FROM likes
       WHERE user_id=${req.user.user_id}
       AND concept_id=${req.body.concept_id}`
    )
    .then(data => {
      res.json("success");
    })
    .catch(error => {
      res.json(error);
    });
}


module.exports = {
  /*-------GET Request-------*/
  logoutUser,
  sortedconceptsbylikes,
  getUser,
  getSingleUser,
  getSingleUserSkills,
  getAllUserLikes,
  getSingleConcept,
  isFavorite,
  getSingleConceptSkills,
  /*-------POST Request-------*/
  loginUser,
  registerUser,
  addSkills,
  addPoints,
  createConcept,
  conceptSkills,
  favoriteConcept,
  unfavoriteConcept,
  /*-------PATCH Request-------*/
}
