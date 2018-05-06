import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from "axios";
import { Link } from "react-router-dom";
import notificationicon from "../images/notification.png";


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '25%',
    textAlign             : 'center'
  }
};

Modal.setAppElement('#root')

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      modalIsOpen: false,
      seenComments: false,
      seenLikes: false,
      seenFollowers: false,
      seenPotluckInvitation: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false, message: ''});
    axios
      .patch(`/users/seenLikesChangeByUserId/${this.props.id}`)
      .then( () => {
        this.setState({
          seenLikes: false
        })
      })
      .then( () => {
        axios
          .patch(`/users/seenFollowersChangeByUserId/${this.props.id}`)
          .then( () => {
            this.setState({
              seenFollowers: false
            })
          })
      })
      .catch( (err) => {
        console.log(err);
      })
  }

  componentDidMount() {
    axios
      .get(`/users/seenComments/${this.props.id}`)
      .then( (res) => {
        this.setState({
          seenComments: res.data
        })
      })
      .then( () => {
        axios
          .get(`/users/seenLikes/${this.props.id}`)
          .then( (res) => {
            this.setState({
              seenLikes: res.data
            })
          })
      })
      .then( () => {
        axios
          .get(`/users/seenFollowers/${this.props.id}`)
          .then( (res) => {
            this.setState({
              seenFollowers: res.data
            })
          })
      })
      .then( () => {
        axios
          .get(`/users/seenPotluckInvitation/${this.props.id}`)
          .then( (res) => {
            this.setState({
              seenPotluckInvitation: res.data
            })
          })
      })
      .catch( (err) => {
        console.log(err);
      })
  }

  handleFormInput = e => {
    const { confirmpassword, password, message } = this.state
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { seenComments, seenLikes, seenFollowers, seenPotluckInvitation } = this.state
    var notificationButton = seenComments.length > 0 || seenLikes.length > 0? "New Notifications": "No Notifications";
    var notificationClass = seenComments.length > 0 || seenLikes.length > 0? "alert notificationButton": "noAlert notificationButton";

    return (
      <div className="Modal">
      <div className="tooltip5">
      <img src={notificationicon} className={notificationClass} onClick={this.openModal} />
          <span className="tooltiptext5"> {seenComments.length+seenLikes.length >= 0 ? seenComments.length+seenLikes.length : 0}  Notifications </span>
      </div>

          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            >
            <h3>Hi {this.props.user}!</h3>
            <ul type="none">
              {seenComments.length > 0? seenComments.map(comment => (
                    <li className="ingredientList" key={Math.random()}>
                      <Link to={`/cl/${this.props.id}/${comment.concept_id}`}>💬 you have a new message from {comment.username} for your {comment.concept_name}</Link>
                    </li>
                  ))
                  : ""}
                  {seenLikes.length > 0? seenLikes.map(likes => (
                    <li className="ingredientList" key={Math.random()}>
                      {likes.username} 💡 your {likes.concept_name}
                    </li>
                  ))
                :""}
                {seenFollowers.length > 0? seenFollowers.map(follower => (
                  <li className="ingredientList" key={Math.random()}>
                    {follower.username} started following you 👣!
                  </li>
                ))
              :""}
                {seenPotluckInvitation.length > 0? seenPotluckInvitation.map( (info) => (
                  <li className="ingredientList" key={Math.random()}>
                    <Link to={`/cb/potluck/${info.potluck_id}`}>{info.username} invited you to {info.potluck_name}<br/>more info...</Link>
                  </li>
                )): ""}
                {(seenComments.length === 0 && seenLikes.length === 0 && seenFollowers.length === 0 && seenPotluckInvitation.length === 0)? "There are no notifications": ""}
            </ul>
          <button className="xButton" onClick={this.closeModal}>x</button>
          </Modal>
        </div>
    );
  }
}

export default Notifications;
