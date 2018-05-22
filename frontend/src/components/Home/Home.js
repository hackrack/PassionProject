/* eslint-disable */
import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
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
        console.log(err.response.statusText);
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
    return (
      <div className="home_div">
        <p>got idea and you want to implement it? make your team, to make your dream</p>
        <div className="landButton">
            <div className="button" type="button"><LoginUser /></div>
          {loggedIn !== "loggedIn"?<button onClick={this.handleClickRegister} className="button">Register</button> :""}
        </div>
        <br/>
        {concepts.map( concept => <div onClick={this.handleConceptBox} key={Math.random()}><ConceptBox  concept={concept} /></div>) }
      </div>
    );
  }
}

export default Home;
