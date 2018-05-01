import React,  { Component } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import "./Register.css";
import Searchbar from "../Search/SearchBar";
import { Redirect } from 'react-router';

let questions =
[
  {id: 1, q: "Are you Optimist?"},
  {id: 2, q: "Do you beleive that there are a lot of unique ideas?"},
  {id: 3, q: "Do you beleive for startup businesses?"},
  {id: 4, q: "Are you a creative?"},
  {id: 5, q: "How you can work with new team?"},
  {id: 6, q: "Are you responsible?"},
  {id: 7, q: "Are you reliable?"},
  {id: 8, q: "Are you punctual?"},
  {id: 9, q: "Are you persistent?"},
  {id: 10,q: "Are you reasonable?"},
  {id: 11,q: "Are you ambitious?"},
  {id: 12,q: "Are you Enthusiastic?"},
  {id: 13,q: "Are you strong minded?"},
  {id: 14,q: "Patient?"},
  {id: 15,q: "Are you honest?"}
];

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      skills: [{name:''}],
      username: "",
      password: "",
      confirm_pass: "",
      fullname: "",
      email: "",
      location: "",
      travel_coverage: "",
      message: "",
      points: [],
      remoteInfo: "",
      user_id: "",
      redirect: false,
      user_id: ""
    }
  }

  handleRemoveSkills = idx => () => {
    const {skills} = this.state;
    this.setState({
      skills: skills.filter((s, sidx) => idx !== sidx)
    });
  }

  handleAddSkills = () => {
    this.setState({
      skills: [...this.state.skills , { name: ''}]
    });
  }

  handleSkillsChange = (idx) => (e) => {
    const newSkills = this.state.skills.map((skill, sidx) => {
      if (idx !== sidx) return skill;
        return { ...skill, name: e.target.value };
      });
    this.setState({ skills: newSkills });
  }

  handleFormInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSelectValue = (e) => {
    const { points } = this.state;
      for (var i = 0; i < questions.length; i++) {
        if (points[i] === undefined) {
          this.setState({
            points: [...points, {id: e.target.id, q: e.target.value}]
          })
        } else if (e.target.id === points[i].id) {
          this.setState({
            points: [...points, {id: e.target.id, q: e.target.value}]
          })
        }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {username, fullname, email,
           password, confirm_pass,
           location, skills, points, travel_coverage } = this.state;
    var userId = "";
    axios
      .post('/users/register', {
        username: username,
        password: password,
        fullname: fullname,
        location: location,
        email: email,
        travel_coverage: travel_coverage
      })
      .then(res => {
        userId = res.data.data.user_id;
        this.setState({user_id: res.data.data.user_id});
        axios
          .post(`/users/addPoints`, {
            user_id: res.data.data.user_id,
            points: points,
          })

      })
      .then( () => {
        axios.post(`/users/addSkills`, {
          user_id: userId,
          skills: skills
        })
      })
      .then( () => {
        axios
          .post("/users/login", {
            username: username,
            password: password
          })
      })
      .then( (res) => {
        this.setState({
          username : "",
          password : "",
          confirm_pass: "",
          skills: [{name:''}],
          fullname: "",
          location: "",
          email: "",
          travel_coverage: "",
          points: [],
          redirect: true
        })
      })
      .then( () => {
        this.props.history.push(`/cl/profile/${userId}`)
        window.location.reload();
      })
      .catch(err => {
        this.setState({
          message: `Error registering. ${username} already exist`,
        });
      })
  }

  render() {
    const { confirm_pass, password, username, email, skills, points, remoteInfo, travel_coverage, redirect, user_id } = this.state;
    // if (redirect) {
    //   return <Redirect to={`/cl/profile/${user_id}`} />
    // }
    return(
      <div>
        <p>The System will get your provided
           info and finds you exact match concept
           or team that you can work out in future
        </p>
        <h3>Get Register</h3>
        <form onSubmit={this.handleSubmit}>
          <input className="formInput" onChange={this.handleFormInput} type="text" name="username" placeholder="username" required/><br/>
          <input className="formInput" onChange={this.handleFormInput} type="text" name="fullname" placeholder="full name" required/><br/>
          <input className="formInput" onChange={this.handleFormInput} type="email" name="email" placeholder="email" required/><br/>
          <input className="formInput" onChange={this.handleFormInput} type="password" name="password" placeholder="password" required/><br/>
          <input className="formInput" onChange={this.handleFormInput} type="password" name="confirm_pass" placeholder="confirm password" required/><br/>
          <input className="formInput" onChange={this.handleFormInput} type="text" name="location" placeholder="City, State, Country" required/><br/>
          <input className="formInput" onChange={this.handleFormInput} type="text" name="travel_coverage" placeholder="If Concept is not remote how far you can travel or Remote only?" required/><br/>
          <p> {this.state.message} </p>
          <p> {password !== confirm_pass && confirm_pass? 'passwords do not match' : ''} </p>
          <p> {password && password.length < 6 ? 'password must be 6 characters' : ''} </p>
          <h4>Personal Characteristics</h4>
          {questions.map( (question) => {
            return <div className="userProfileSelectContainer">
                <p className="selectUserRecipeTagline">{question.q}{" "}</p>
                <div className="select-style">
                  <select onChange={this.handleSelectValue} id={question.id}>
                    <option value="">select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
            })}
            <h4>Your Skills</h4>
            <div className="formInnerWrap">
              {skills.map((skill, idx) =>(
                <div className="ingredients">
                  <label className="formLabels"> <b>{`Skill ${idx + 1}`}</b>
                    <input
                        list="skills"
                        value ={skill.name}
                        onChange={this.handleSkillsChange(idx)}
                        className="formInput"
                     />
                      <button
                        type="button"
                        className="xButton"
                        onClick={this.handleRemoveSkills(idx)}>x
                      </button>
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="formButton"
                onClick={this.handleAddSkills}>
                ADD SKILLS
              </button>
              <br></br><br></br>
              <button className="formButton">Register</button>
          </div>
          </form>
      </div>
    )
  }
}
export default Register;
