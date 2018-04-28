import React from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import { Link, Redirect } from "react-router-dom";
import ConceptBox from "../SingleConcept/ConceptBox";
import "./Home.css";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      concepts: []
    }
  }

  componentDidMount() {
    axios
      .get("/users/sortedconceptsbylikes")
      .then( (res)=> {
        this.setState({
          concepts: res.data
        })
      })
      .catch( (err) => {
        console.log(err);
      })
  }

  render() {
    const { concepts } = this.state;
    console.log(concepts[0]);
    return (
      <div className="App-header">
        <p>got idea and you want to implement it? make your team, to make your dream</p>

        {concepts.map( concept => <ConceptBox concept={concept} />) }
      </div>
    );
  }
}

export default Home;
