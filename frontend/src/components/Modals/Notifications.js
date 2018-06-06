/* eslint-disable */
import React, { Component } from 'react';
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

      })
      .then( () => {

      })
      .catch( (err) => {
        console.log(err);
      })
  }

  handleFormInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { seenComments, seenLikes } = this.state
    var notificationButton = seenComments.length > 0 || seenLikes.length > 0? "New Notifications": "No Notifications";
    var notificationClass = seenComments.length > 0 || seenLikes.length > 0? "alert notificationButton": "noAlert notificationButton";

    return (
      <div className="Modal">
      <div className="tooltip5">
      <img
        src={notificationicon}
        className={notificationClass}
        onClick={this.openModal}
        alt="notificationicon"
      />
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
                      <Link to={`/cl/${this.props.id}/${comment.concept_id}`}><span role="img" aria-label="message">💬 </span>you have a new message from {comment.username} for your {comment.concept_name}</Link>
                    </li>
                  ))
                  : ""}
                  {seenLikes.length > 0? seenLikes.map(likes => (
                    <li className="ingredientList" key={Math.random()}>
                      {likes.username} 💡 your {likes.concept_name}
                    </li>
                  ))
                :""}
                {(seenComments.length === 0 && seenLikes.length === 0)? "There are no notifications": ""}
            </ul>
          <button className="xButton" onClick={this.closeModal}>x</button>
          </Modal>
        </div>
    );
  }
}

export default Notifications;
