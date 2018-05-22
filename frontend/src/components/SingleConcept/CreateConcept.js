/* eslint-disable */
import React from "react";
import { Redirect } from 'react-router';
import axios from "axios";
import Searchbar from "../Search/SearchBar";
import "./CreateConcept.css";
var conceptId = "";
const languages =
[
  "Select", 'Javascript', "SQL", "Java", "C#",
  "Python", "PHP", "C++", "C", "Typescript",
  "Ruby", "Swift", "Objective-C", "Node",
  "Matlab","Scala", "CoffeeScript", "Haskell",
]
class CreateConcept extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      is_remote: "",
      concept_name: "",
      description: "",
      location: "",
      redirect: false,
      skillsType: []
    }
  }

  handleRemoveSkills = idx => () => {
    const {skills} = this.state;
    this.setState({
      skills: skills.filter((s, sidx) => idx !== sidx)
    });
  }

  handleRemoveSkillsType = idx => () => {
    const {skillsType} = this.state;
    this.setState({
      skillsType: skillsType.filter((s, sidx) => idx !== sidx)
    });
  }

  handleAddSkills = () => {
    this.setState({
      skills: [...this.state.skills , { name: ''}]
    });
  }

  handleTypeSkills = () => {
    this.setState({
      skillsType: [...this.state.skillsType , { name: ''}]
    });
  }

  handleSkillsChange = (idx) => (e) => {
    const newSkills = this.state.skills.map((skill, sidx) => {
      if (idx !== sidx) return skill;
        return { ...skill, name: e.target.value };
      });
    this.setState({ skills: newSkills });
  }

  handleSkillsTypeChange = (idx) => (e) => {
    const newSkills = this.state.skillsType.map((skill, sidx) => {
      if (idx !== sidx) return skill;
        return { ...skill, name: e.target.value };
      });
    this.setState({ skillsType: newSkills });
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
            location, skills, skillsType } = this.state;
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
          skills: [...skills, ...skillsType]
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
        this.setState({ redirect: true });
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    const { is_remote, skills, redirect, skillsType } = this.state;
    let hide_location = true;
    is_remote === "no" ? hide_location = false : "";
    if (redirect) {
      return <Redirect to={`/cl/${this.props.user.user_id}/${conceptId}`} />
    }
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
                  <div className="formInput">
                    <label className="label"> <b>{`Skill  ${ idx + 1}`}</b>{" "}
                      <select onChange={this.handleSkillsChange(idx)}>
                     {languages.map( (language) => {
                         return <option value={language}>{language}</option>
                       })}
                      </select>
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
                  SELECT SKILLS
                </button><br/><br/>
              {skillsType.map((skill, idx) =>(
                  <div className="formInput">
                    <label className="label"> <b>{`Skill  ${ idx + 1}`}</b>{" "}
                      <input
                          list="ingredients"
                          value ={skill.name}
                          onChange={this.handleSkillsTypeChange(idx)}
                          className="formInput"
                       />
                        <button
                          type="button"
                          className="xButton"
                          onClick={this.handleRemoveSkillsType(idx)}>x
                        </button>
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  className="formButton"
                  onClick={this.handleTypeSkills}>
                  TYPE SKILLS
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
