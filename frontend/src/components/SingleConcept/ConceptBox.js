/* eslint-disable */
import React from "react"
import { Link } from 'react-router-dom';
import "./ConceptBox.css";
import axios from "axios";


function findLanguage(arr1, arr2) {
  for (var i = 0; i < arr2.length; i++) {
    var conceptSkill = arr2[i];
    if (arr1.includes(conceptSkill)) {
      return conceptSkill;
    }
  }
}


function matchSkills(user, concept) {
  const languages =
    [
      'javascript', "sql", "java", "c#",
      "python", "php", "c++", "c", "typescript",
      "ruby", "swift", "objective-c", "node",
      "matlab","scala", "coffeescript", "haskell"
    ];

  var percent = 0;
  // var quantityConceptSkills = concept.length - 1;
  var mainLanguage = findLanguage(languages, concept);
  var userMainLang = user.includes(mainLanguage)
  if (userMainLang) {
    percent = 50;
  }
  var threeCharsUserSkills = user.map( (lang) => {
    return lang.slice(0, 3);
  })
  var countedMatchSkills = concept.filter( (lang) => {
    return threeCharsUserSkills.includes(lang.slice(0, 3));
  })
  var getPercent = (threeCharsUserSkills.length - 1) * 50 / (concept.length - 1);
  return percent + Math.floor(getPercent) + "%";
}


function compareTwoArrays(arr1, arr2) {
  var count = 0;
  for (var i = 0; i < arr1.length; i++) {
    var num1 = arr1[i];
    var num2 = arr2[i];
    if (num1 !== num2) {
      count += Math.abs(num1 - num2);
    }
  }
  return count;
}

function findExactMatch(arr1, arr2) {
  var result = compareTwoArrays(arr1, arr2);
  var step1 = result * 100 / 75;
  var step2 = Math.ceil(Math.abs(step1 - 100));
  return step2 + "%";
}

class ConceptBox extends React.Component {
  render() {
    const { concept_name, username,
            bulbs, skillssortedbyid, concept_id,
            user_id, description, concept_timestamp } = this.props.concept;
    const { ownerPoints, othersPoints, userSkills, conceptSkills, accountOwner, userId } = this.props;
    let ts = new Date(concept_timestamp);
    let timestamp = ts.toDateString(ts);
    let cuttedDescription = description.split(" ").slice(0,10).join(" ");
    let showPercentage;
    let showSkillsPercentage;
    ownerPoints && othersPoints? showPercentage = findExactMatch(ownerPoints, othersPoints):""
    userSkills && conceptSkills? showSkillsPercentage = matchSkills(userSkills, conceptSkills):""

    return (
      <div className="concept_box">
        <Link to={`/cl/${user_id}/${concept_id}`} style={{ "textDecoration": 'none' }}>
          <h3>{username}</h3>
          <h2>{concept_name}</h2>
          <p>description: {cuttedDescription}...More info</p>
          <p>required skills: {skillssortedbyid}</p>
          {accountOwner != user_id && ownerPoints && othersPoints?<h3>Personal match with {username} {showPercentage}</h3>:""}
          {accountOwner != user_id && userSkills && conceptSkills?<h3>Skills match with {concept_name} {showSkillsPercentage}</h3>:""}
          <div className="likes">
            <img
              src="https://cdn0.iconfinder.com/data/icons/colourful-education/250/bulb-512.png" alt="bulbs"
              className="concept_box_fav"
            />
          <p className="fav">{bulbs}</p>
          </div>
          <p>uploaded {timestamp}</p>
            {userId == user_id? <p style={{"fontSize": "10px", "color":"red", "marginLeft":"70%"}}>*This is your concept</p>:""}
            {accountOwner == user_id && userId !== user_id? <p style={{"fontSize": "10px", "color":"red", "marginLeft":"70%"}}>* user's concept</p>:""}
        </Link>
      </div>
    )
  }
}

export default ConceptBox;
