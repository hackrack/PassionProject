import React, { Component } from "react";
import { Redirect } from 'react-router';
import axios from "axios";
import ReactDOM from "react-dom";
import Searchbar from "../Search/SearchBar";
import "./CreateConcept.css";

class CreateConcept extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      is_remote: "",
      concept_name: "",
      description: "",
      location: ""
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

  handleSelect = (e) => {
    this.setState({
      is_remote: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { concept_name, description, is_remote,
            location, skills } = this.state;
    var conceptId = "";
    axios
      .post('/users/createconcept', {
        concept_name: concept_name,
        description: description,
        is_remote: is_remote,
        location: location,
      })
      .then(res => {
        conceptId = res.data.concept_id;
        axios.post(`/users/conceptskills/${res.data.concept_id}`, {
          skills: skills
        })
      })
      .then( (res) => {
        this.setState({
          concept_name : "",
          description : "",
          is_remote: "",
          skills: [{name:''}],
          location: "",
        })
      })
      .then( (res) => {
        this.props.history.push(`/cl/${this.props.user.user_id}/${conceptId}`)
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    const { concept_name, description, is_remote, location, skills } = this.state;
    let hide_location = true;
    is_remote === "no"? hide_location = false:"";
    return (
      <div>
        <Searchbar user={this.props.user} /><br></br><br></br><br></br>
          <h3>Create Concept</h3><br></br>
          <form onSubmit={this.handleSubmit}>
            <input className="formInput" onChange={this.handleFormInput} type="text" name="concept_name" placeholder="concept name" required/><br/>
            <textarea className="formInput" onChange={this.handleFormInput} type="text" name="description" placeholder="concept description" required/><br/>
            <div className="formInput">
              <label className="label">is concept remote?</label>{" "}
              {" "}<select onChange={this.handleSelect}>
                  <option value="">select</option>
                  <option value="yes">yes</option>
                  <option value="no">no</option>
                </select>
            </div><br/>
            {!hide_location?<div><input className="formInput" onChange={this.handleFormInput} type="text" name="location" placeholder="City, State, Country" required></input><br/></div>:""}
              <h4>Required Skills</h4>
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
                <button className="formButton">Submit</button>
            </div>
            </form>
      </div>
    )
  }
}
export default CreateConcept;
