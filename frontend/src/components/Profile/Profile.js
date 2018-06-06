/* eslint-disable */
import React from "react";
import axios from "axios";
import "./Profile.css";
import ConceptBox from "../SingleConcept/ConceptBox";
import Searchbar from "../Search/SearchBar";

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user_concepts: [],
      others_concepts: [],
      skills: [],
      user: "",
      accountOwnerPoints: [],
      allconcepts: [],
      user_skills: "",
      userInfo: []
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
              user_concepts: res.data
            })
          })
      })
      .then( () => {
        axios
          .get(`/users/userlikes/${this.props.id}`)
          .then( (res)=> {
            this.setState({
              others_concepts: res.data
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
      .then( () => {
        axios
          .get('/users/accountOwnerPoints')
          .then( (res) => {
            var points = Object.values(res.data[0]);
            this.setState({
              accountOwnerPoints: points
            })
          })
          .then( () => {
            axios
              .get('/users/user_skills')
              .then( (res) => {
                this.setState({
                  user_skills: res.data[0]['user_skill']
                })
              })
          })
          .then( () => {
            axios
              .get('/users/allconcepts')
              .then( (res) => {
                this.setState({
                  allconcepts: res.data
                })
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
    const { user_skills, allconcepts, accountOwnerPoints, userInfo, user_concepts, others_concepts } = this.state;
    let concepts = [...user_concepts, ...others_concepts];
    let userSkills = user_skills.split(", ")
    let othersPoints = [];
    let all_skills = [];
    allconcepts.forEach( (ele, i) => {
      var subArr = [];
      for (var key in ele) {
        if (key.includes('question')) {
          subArr.push(ele[key]);
        }
      }
      othersPoints.push(subArr);
    })
    allconcepts.forEach( (ele, i) => {
      var subArr = [];
      for (var key in ele) {
        if (key.includes('all_skills')) {
          subArr = ele[key].split(", ");
        }
      }
      all_skills.push(subArr);
    })
    let userId = this.props.user.user_id;
    if (this.state.user && this.props.user) {
      return(
        <div>
          <Searchbar user={this.props.user} />
          <br></br><br></br>
          <div className="userProfileContainer">
            <div className="userProfileHeading">
              <img className="userProfileImage" src="https://openclipart.org/download/247324/abstract-user-flat-1.svg" alt="user_img" />
              <div className="userProfileName">
                <p>username <strong>{this.state.user[0].username}</strong></p>
                <p>fullname <strong>{this.state.user[0].fullname}</strong></p>
                <p>email <strong>{this.state.user[0].email}</strong></p>
                <p>location <strong>{this.state.user[0].location}</strong></p>
                <p>travel coverage {this.state.user[0].travel_coverage}</p>
              </div>
            </div>
          </div>
          <div className="user_skills_list">
            <h3 className="singleRecipeIngredientsTitle"> User skills </h3>
            <ul>
              {this.state.skills.map( (skill) =>
                <li key={Math.random()}>{skill.user_skill}</li>
              )}
            </ul>
          </div>
          {concepts.map( (concept, i) =>
            <div  key={Math.random()}>
              <ConceptBox
                accountOwner={this.props.id}
                ownerPoints={accountOwnerPoints}
                othersPoints={othersPoints[i]}
                userSkills={userSkills}
                conceptSkills={all_skills[i]}
                concept={concept}
                userId={userId}
              />
            </div>)
          }
        </div>
      )
    } else {
      return  <div>loading...</div>
    }
  }
}
export default Profile;
