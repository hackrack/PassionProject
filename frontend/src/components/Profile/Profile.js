import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import ConceptBox from "../SingleConcept/ConceptBox";
import Searchbar from "../Search/SearchBar";

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      concepts: [],
      skills: [],
      user: ""
    }
  }

  userInfo = (props) => {
    axios
      .get(`/users/profile/${this.props.id}`)
      .then( (res) => {
        this.setState({
          user: res.data
        })
      })
      .then( () => {
        axios
          .get(`/users/userconcept/${this.props.id}`)
          .then( (res) => {
            this.setState({
              concepts: res.data
            })
          })
      })
      .then( () => {
        axios
          .get(`/users/userlikes/${this.props.id}`)
          .then( (res)=> {
            this.setState({
              concepts: [...this.state.concepts, ...res.data]
            })
          })
      })
      .then( () => {
        axios
          .get(`/users/profile/skills/${this.props.id}`)
          .then( (res)=> {
            this.setState({
              skills: res.data
            })
          })
      })
      .catch( (err) => {
        console.log(err);
      })
  }

  componentDidMount(props) {
    this.userInfo();
  }

  componentWillReceiveProps(props) {
      this.userInfo();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.userInfo();
    }
  }


  render() {
    const { username, email, fullname,
            travel_coverage, location, user_id, skills} = this.props.user;
    if (this.state.user && this.props.user) {
      return(
        <div>
          <Searchbar user={this.props.user} />
          <div className="userProfileContainer">
            <div className="userProfileHeading">
              <img className="userProfileImage" src="https://openclipart.org/download/247324/abstract-user-flat-1.svg" alt="user_img" />
              <div className="userProfileName">
                <p>username {this.state.user[0].username}</p>
                <p>fullname {this.state.user[0].fullname}</p>
                <p>email {this.state.user[0].email}</p>
                <p>location {this.state.user[0].location}</p>
                <p>travel coverage {this.state.user[0].travel_coverage}</p>
              </div>
            </div>
          </div>
          User skills {this.state.skills.map( (skill) => <div>{skill.user_skill}</div>)}
          {this.state.concepts.map( concept => <div><ConceptBox  concept={concept} key={Math.random()}/></div>) }
        </div>
      )
    } else {
      return  <div>loading...</div>
    }
  }
}
export default Profile;
