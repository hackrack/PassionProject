import React from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import { Link, Redirect } from "react-router-dom";
import ConceptBox from "../SingleConcept/ConceptBox";
import LoginUser from "../Modals/LoginUser";

import "./Home.css";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      concepts: [],
      loggedIn: false,
      register: false
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
      .then( () => {
        axios
         .get('/isloggedin')
         .then(res => {
           this.setState({
             loggedIn: res.data
           })
         })
         .catch( (err) => {
           this.setState({
             loggedIn: err.response.status
           })
         })
      })
      .catch( (err) => {
        console.log(err);
      })
  }

  handleClickRegister = () => {
    this.setState({
      register: true
    })
  }

  render() {
    const { concepts, loggedIn } = this.state;
    if (this.state.register === true) {
      return <Redirect to='/cl/register' />
    }
    console.log(concepts);
    return (
      <div className="home_div">
        <p>got idea and you want to implement it? make your team, to make your dream</p>
        <div className="landButton">
          <button className="button">
            <LoginUser />
          </button>
          {loggedIn !== "loggedIn"?<button onClick={this.handleClickRegister} className="button">Register</button> :""}
        </div>
        <br/>
        {concepts.map( concept => <div onClick={this.handleConceptBox}><ConceptBox  concept={concept} key={Math.random()}/></div>) }
      </div>
    );
  }
}

export default Home;
