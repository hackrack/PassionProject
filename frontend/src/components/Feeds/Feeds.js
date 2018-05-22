/* eslint-disable */
import React from 'react';
import axios from 'axios';
import ConceptBox from '../SingleConcept/ConceptBox';
import Searchbar from "../Search/SearchBar";

class Feeds extends React.Component {

  constructor() {
    super();
    this.state = {
      accountOwnerPoints: [],
      allconcepts: [],
      user_skills: "",
      userInfo: []
    }
  }

  componentWillMount() {
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
          .get(`/users/profile/${this.props.id}`)
          .then( (res) => {
            this.setState({
              userInfo: res.data[0]
            })
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
      .catch( (err) => {
        console.log(err);
      })
  }

  render() {
    const { user_skills, allconcepts, accountOwnerPoints, userInfo } = this.state;
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
    return(
      <div>
        {userInfo?<Searchbar user={userInfo}/>:""}
        <br></br><br></br><br></br><br></br>
        {allconcepts.map( (concept, i) =>
          concept.user_id !== this.props.id?
          <div key={Math.random()}>
            <ConceptBox
              ownerPoints={accountOwnerPoints}
              othersPoints={othersPoints[i]}
              concept={concept}
              userSkills={userSkills}
              conceptSkills={all_skills[i]}
            />
          </div>:"")
        }
      </div>
    )
  }
}

export default Feeds;
