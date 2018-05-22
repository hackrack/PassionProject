/* eslint-disable */
import React from "react";
import axios from "axios";

class EditConcept extends React.Component {
  constructor() {
    super();
    this.state = {
      concept_name: "",
      description: "",
      is_remote: "",
      location: "",
      skills: [],
      user_id: ""
    }
  }

  componentDidMount() {
    axios
    .get(`/users/singleconcept/${this.props.match.params.concept_id}`)
    .then(res => {
      this.setState({
        concept_name: res.data[0].concept_name,
        description: res.data[0].description,
        is_remote: res.data[0].is_remote,
        location: res.data[0].location,
        user_id: res.data[0].user_id
      });
    })
    .then( () => {
      axios
        .get(`/users/conceptskills/${this.props.match.params.concept_id}`)
        .then(res => {
          this.setState({
            skills: res.data
          });
        })
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleChange = e => {
    this.setState({
        [e.target.name]: e.target.value
    })
  }

  handleSkillsChange = (idx) => (e) => {
    const newSkills = this.state.skills.map((skill, sidx) => {
      if (idx !== sidx) return skill;
        return { ...skill, concept_skill: e.target.value };
      });
    this.setState({ skills: newSkills });
  }

  handleAddSkills = () => {
    this.setState({
      skills: [...this.state.skills, { concept_skill: ''}]
    });
  }

  handleRemoveSkills = idx => () => {
    const {skills} = this.state;
    this.setState({
      skills: skills.filter((s, sidx) => idx !== sidx)
    });
  }

  handleSelect = (e) => {
    this.setState({
      is_remote: e.target.value
    })
  }

  handleFormInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { concept_name, description, is_remote,
            location, skills } = this.state;

    axios
      .patch(`/users/editconcept/${this.props.match.params.concept_id}`, {
        concept_name: concept_name,
        description: description,
        is_remote: is_remote,
        location: location,
      })
      .then(res => {
        axios.patch(`/users/editconceptskills/${this.props.match.params.concept_id}`, {
          skills: skills
        })
      })
      .then( (res) => {
        this.setState({
          concept_name : "",
          description : "",
          is_remote: "",
          skills: [],
          location: ""
        })
      })
      .then( (res) => {
        this.props.history.push(`/cl/${this.state.user_id}/${this.props.match.params.concept_id}`)
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      })
  }


    render() {
      const { concept_name, description, is_remote, location, skills } = this.state;
      let show_location = true;
      let selectValue = "yes";
      is_remote? selectValue:"no";
      is_remote === "yes"? show_location = false:"";
      return (
        <div>
          {/*<Searchbar user={this.props.user} /><br></br><br></br><br></br>*/}
            <h3>Edit Concept</h3><br></br>
            <form onSubmit={this.handleSubmit}>
              <input className="formInput" onChange={this.handleFormInput} type="text" name="concept_name" placeholder="concept name" value={concept_name} required/><br/>
              <textarea className="formInput" onChange={this.handleFormInput} type="text" name="description" placeholder="concept description" value={description} required/><br/>
              <div className="formInput">
                <label className="label">is concept remote?</label>{" "}
                {" "}<select onChange={this.handleSelect}>
                    <option>{selectValue}</option>
                    <option value="">select</option>
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                  </select>
              </div><br/>
            {show_location?<div><input className="formInput" onChange={this.handleFormInput} type="text" name="location" placeholder="City, State, Country" value={location} required></input><br/></div>:""}
                <h4>Required Skills</h4>
                <div className="formInnerWrap">
                  {skills? skills.map((skill, idx) =>(
                    <div className="ingredients" key={Math.random()}>
                      <label className="formLabels"> <b>{`Skill ${idx + 1}`}</b>
                        <input
                            list="skills"
                            value ={skill.concept_skill}
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
                  )):""}
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

export default EditConcept;
