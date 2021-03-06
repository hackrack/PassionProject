/* eslint-disable */
import React from 'react';
import axios from 'axios';
import { Route, Switch, Redirect } from 'react-router';
import Register from "./Register/Register"
import Profile from "./Profile/Profile";
import CreateConcept from './SingleConcept/CreateConcept';
import Concept from './SingleConcept/SingleConcept';
import EditConcept from './SingleConcept/EditConcept';
import Feeds from './Feeds/Feeds';

class Cluster extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      fetchingUser: "",
    }
  }

  componentWillMount() {
    axios.get('/users')
      .then( response => {
        if (response.data) {
          this.setState({
            user: response.data[0],
            fetchingUser: false
          })
        }
      })
      .catch(error => {
        console.log(error.response.data.status)
      })
  }

  renderUserProfile = props => {
    const { user, fetchingUser } = this.state
    if (fetchingUser) {
      return <div>loading!</div>
    } else {
      return <Profile user={user} id={props.match.params.user_id} />
    }
  }

  renderCreateConcept = props => {
    const { user, fetchingUser } = this.state
    if (fetchingUser) {
      return <div>loading!</div>
    } else {
      return <CreateConcept user={user} id={props.match.params.user_id} />
    }
  }

  renderSingleConcept = props => {
    const { user } = this.state
    return <Concept id={user.user_id} user={props.match.params}  userinfo={user} />
  }

  renderFeeds = props => {
    const { user } = this.state;
    return <Feeds id={user.user_id} />
  }

  render() {
    return (
     <div>
       <Switch>
         <Route path="/cl/register" component={Register} />
         <Route path="/cl/profile/:user_id" render={this.renderUserProfile} />
         <Route path='/cl/createconcept' render={this.renderCreateConcept} />
         <Route path='/cl/editconcept/:concept_id' component={EditConcept} />
         <Route path='/cl/feeds' render={this.renderFeeds} />
         <Route exact path='/cl/:user_id/:concept_id' render={this.renderSingleConcept} />
         <Route exact path='/cl/:some/:concept_id' render={this.renderSingleConcept} />
       </Switch>
     </div>
   )
  }
}

export default Cluster;
