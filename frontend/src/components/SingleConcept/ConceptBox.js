import React from "react"
import { Link, Route, Switch } from 'react-router-dom';
import "./ConceptBox.css";
import axios from "axios";

class ConceptBox extends React.Component {
  render() {
    const { concept_name, username,
            bulbs, skillssortedbyid, concept_id,
            user_id, description, concept_timestamp } = this.props.concept;
    let ts = new Date(concept_timestamp);
    let timestamp = ts.toDateString(ts);
    let cuttedDescription = description.split(" ").slice(0,10).join(" ");
    return (
      <div className="concept_box">
        <Link to={`/cl/${user_id}/${concept_id}`} style={{ textDecoration: 'none' }}>
          <h3>{username}</h3>
          <h2>{concept_name}</h2>
          <p>description: {cuttedDescription}...More info</p>
          <p>required skills: {skillssortedbyid}</p>
          <div className="likes">
            <img
              src="https://cdn0.iconfinder.com/data/icons/colourful-education/250/bulb-512.png" alt="bulbs"
              className="concept_box_fav"
            />
            <p className="fav">{bulbs}</p>
          </div>
          <p>uploaded {timestamp}</p>
        </Link>
      </div>
    )
  }
}

export default ConceptBox;
