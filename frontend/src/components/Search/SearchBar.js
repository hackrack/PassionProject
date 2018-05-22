/* eslint-disable */
import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import "./SearchBar.css";
import Notifications from "../Modals/Notifications";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "15%",
    height: "28%",
    textAlign: "center"
  }
};

Modal.setAppElement("#root");

class Searchbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      message: ""
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleClickLogout = e => {
    axios
      .get(`/users/logout`)
      .then(res => {
        this.setState({
          message: res.data,
          redirectLanding: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleModalClick = e => {
    this.setState({
      modalIsOpen: false
    });
  };

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false, message: "", redirect: false });
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  showSettings(event) {
    event.preventDefault();
  }



  render() {
    const { } = this.state;
    return (
      <div className="searchbar">
        <Link to={`/cl/feeds`}>
          <img className="searchbarLogoName hoverIncrease" src="https://cluster-web-static.storage.googleapis.com/images/marketing/presskit/cluster-logo-blue-v279f29aa.png" />
        </Link>
        <div className="menuicons">
          <div className="tooltip1">
            <Link to={`/`} className="searchLink">
              <span className="tooltiptext1"> Concept </span>
            </Link>
          </div>
            <div className="tooltip2">
              <Link to={`/cl/profile/${this.props.user.user_id}`}>
                <span className="tooltiptext2"> Profile </span>
              </Link>
            </div>
        </div>
        <Notifications id={this.props.user.user_id} user={this.props.user.username}/>
        <div>
          <Menu right className="burgerMenu">
            <a
              id="contact"
              className="menu-item"
              href={`/cl/profile/${this.props.user.user_id}`}
            >
              Profile
            </a>
            <a
              id="contact"
              className="menu-item"
              href={`/cl`}
              >
              Edit Profile
            </a>
            <a
              id="contact"
              className="menu-item"
              href={`/cl/profile/${this.props.user.user_id}/favorites`}
            >
              Favorite Recipes
            </a>
            <a
            id="contact"
            className="menu-item"
            href={`/cl/createconcept`}
          >
            Create a Concept
          </a>
            <a id="contact" className="menu-item" href="/cl/feeds">
              Feed
            </a>
          <a
          id="contact"
          className="menu-item"
          href="/"
          onClick={this.handleClickLogout}
        >
          Logout
        </a>
          </Menu>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <button onClick={this.closeModal}>close</button>
        </Modal>
      </div>
    );
  }
}

export default Searchbar;
