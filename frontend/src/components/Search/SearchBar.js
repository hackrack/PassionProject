import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import "./SearchBar.css";
import Notifications from "../Modals/Notifications";


function getSuggestionValue(suggestion) {
  return suggestion.identifier;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion.identifier}</span>;
}

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
      searchInput: "",
      value: "",
      suggestions: [],
      redirect: false,
      redirectLanding: false,
      modalIsOpen: false,
      finalSuggestion: "",
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

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
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

  onSuggestionsFetchRequested = ({ value }) => {
    fetch(`/users/searchbyrecipe/${value}`)
      .then(response => response.json())
      .then(data => {
        const dataFormatted = data.map((elem, index) => {
          if (index === 0) {
            return { title: "recipe name", info: elem };
          }
          if (index === 1) {
            return { title: "username", info: elem };
          }
          if (index === 2) {
            return { title: "full name", info: elem };
          }
        });

        const newData = dataFormatted
          .map(elem => elem.info)
          .reduce((prev, curr) => prev.concat(curr));

        this.setState({
          suggestions: newData,
          searchInput: data
        });
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    this.setState({
      finalSuggestion: [suggestion],
      redirect: true,
      value: "",
      modalIsOpen: true
    });
  };

  showSettings(event) {
    event.preventDefault();
  }



  render() {
    const { value, suggestions, redirectLanding } = this.state;
    const inputProps = {
      placeholder: "Search by recipe, username, full name",
      value,
      onChange: this.onChange,
      onKeyPress: this.onKeyPress
    };
console.log("this searchbar: ", this.props.user.user_id);
    return (
      <div className="searchbar">
        <Link to={`/cl/feed`}>
          <img className="searchbarLogoName hoverIncrease" src="https://cluster-web-static.storage.googleapis.com/images/marketing/presskit/cluster-logo-blue-v279f29aa.png" />
        </Link>
        <div className="menuicons">
          <div className="tooltip1">
            <Link to={`/cl/${35}/${7}`} className="searchLink">
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
              href={`/cl/profile/${this.props.user.user_id}/edit`}
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
            <a id="contact" className="menu-item" href="/cb/feed">
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
           <h2 ref={subtitle => (this.subtitle = subtitle)}>Search results</h2>
          <form onSubmit={this.handleLoginFormSubmit} />
          {this.state.finalSuggestion
            ? this.state.finalSuggestion.map(elem => {
                const link = elem.recipe_id
                  ? `/cb/${elem.username}/${elem.recipe_id}`
                  : `/cb/profile/${elem.user_id}`;
                return (
                  <Link
                    to={link}
                    className="searchLink"
                    onClick={this.handleModalClick}
                  >
                    <p key={Math.random()}> {elem.identifier} </p>
                  </Link>
                );
              })
            : "no results"}
          <br />
          <button onClick={this.closeModal}>close</button>
        </Modal>
      </div>
    );
  }
}

export default Searchbar;
