import React from "react"
import { Link, Route, Switch } from 'react-router-dom';
import "./ConceptBox.css";

let ts = new Date();

class ConceptBox extends React.Component {
  render() {
    const { concept_name, username,
            bulbs, skillssortedbyid, concept_id,
            user_id, description, concept_timestamp } = this.props.concept;
    let timestamp = ts.toDateString('concept_timestamp')
    return (
      <div className="concept_box">
        <Link to={`/cl/${user_id}/${concept_id}`} style={{ textDecoration: 'none' }}>
          <h3>{username}</h3>
          {/*<Link to={`/cl/${user_id}/${concept_id}`}> <img src={img} className="recipeImg" alt="recipeImg" style={styles.img} /></Link>*/}
          <h2>{concept_name}</h2>
          <p>{description}</p>
          <p>{skillssortedbyid}</p>
          <div className="likes">
            <img
              src="https://cdn0.iconfinder.com/data/icons/colourful-education/250/bulb-512.png" alt="bulbs"
              className="concept_box_fav"
            />
            <p className="fav">{bulbs}</p>
          </div>
          <p>{timestamp}</p>
        </Link>
      </div>
    )
  }
}

export default ConceptBox;
