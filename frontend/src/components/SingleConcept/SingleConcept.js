import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router"
import axios from "axios";
import Searchbar from "../Search/SearchBar";
import "./Concept.css";


class SingleConcept extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes_count: "",
      username: "",
      user_id: "",
      concept_name: "",
      description: "",
      img: "",
      comments: [],
      skills: [],
      is_favorite: true,
      comment: "",
      comments_id: false,
      seenCommentsArray: [],
    };
  }

  componentDidMount() {
    this.loadsRecipe();
  }

  componentWillReceiveProps(props) {
    this.loadsRecipe();
  }

  componentDidUpdate(prevProps,prevState){
    if(prevProps !== this.props){
      this.loadsRecipe()
    }
  }

  loadsRecipe = () => {
    const { username } = this.state
    axios
      .get(`/users/singleconcept/${this.props.user.concept_id}`)
      .then(res => {
        this.setState({
          favorites_count: res.data[0].favorites_count,
          username: res.data[0].username,
          user_id: res.data[0].user_id,
          concept_name: res.data[0].concept_name,
          description: res.data[0].description,
          location: res.data[0].location,
          is_remote: res.data[0].is_remote,
          concept_timestamp: res.data[0].concept_timestamp
        });
      })
      .then(() => {
        if (this.props.id === this.state.user_id) {
          axios
            .patch(`/users/seenCommentsChangeByRecipeId/${this.props.user.recipeID}`)
            .then( () => {
              this.setState({
                seenCommentsArray: true
              })
            })
        }
      })
      .then( () => {
        axios
          .get(`/users/isfavorite/${this.props.user.concept_id}`)
          .then(res => {
            if (res.data.length === 0) {
              this.setState({
                is_favorite: false
              });
            } else {
              this.setState({
                is_favorite: true
              });
            }
          })
      })
      .then(() => {
        axios
        .get(`/users/conceptskills/${this.props.user.concept_id}`)
        .then(res => {
          this.setState({
            skills: res.data
          });
        })
      })
      .then((user) => {
        axios
          .get(`/users/comment/${this.props.user.concept_id}`)
          .then(res => {
            this.setState({
              comments: res.data
            });
          })
      })
      .then( () => {
          axios
            .get(`/users/seenCommentsByRecipeId/${this.props.user.recipeID}`)
            .then( (res) => {
              this.setState({
                seenCommentsArray: res.data
              })
            })
      })
      .catch(error => {
        console.log("error in Recipe componentDidMount: ", error);
      });
    }


  handleClickLike = e => {
    e.preventDefault();
    const { username } = this.state
    axios
      .post("/users/favorite", {
        concept_id: this.props.user.concept_id,
        seen: false
      })
      .then(() => {
        this.setState({
          is_favorite: true
        });
      })
      .then(() =>
        axios
          .get(`/users/singleconcept/${this.props.user.concept_id}`)
          .then(res => {
            this.setState({
              favorites_count: res.data[0].favorites_count
            });
          })
      )
      .catch(err => {
        console.log(err);
      });
  };

  handleClickDisLike = e => {
    e.preventDefault();
    axios
      .post(`/users/unfavorite`, {
        concept_id: this.props.user.concept_id
      })
      .then(() => {
        this.setState({
          is_favorite: false
        });
      })
      .then(() =>
        axios
          .get(`/users/singleconcept/${this.props.user.concept_id}`)
          .then(res => {
            this.setState({
              favorites_count: res.data[0].favorites_count
            });
          })
      )
      .catch(err => {
        console.log(err);
      });
  };

  handleInputComment = e => {
    this.setState({
      comment: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.comment_id) {
      axios
        .patch(`/users/editComment/${this.state.comment_id}`, {
          concept_id: this.props.user.concept_id,
          comment: this.state.comment
        })
        .then(res => {
          axios
            .get(`/users/comment/${this.props.user.concept_id}`)
            .then(res => {
              this.setState({
                comments: res.data,
                comment: ""
              });
            })
            .catch(error => {
              console.log(error);
            });
          this.setState({
            comments_id: false,
            comment: ""
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      if (this.props.id === this.state.user_id) {
        axios
          .post("/users/addComment", {
            concept_id: this.props.user.concept_id,
            comment: this.state.comment,
            seen: true
          })
          .then(res => {
            axios
              .get(`/users/comment/${this.props.user.concept_id}`)
              .then(res => {
                this.setState({
                  comments: res.data,
                  comment: ""
                });
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        axios
          .post("/users/addComment", {
            concept_id: this.props.user.concept_id,
            comment: this.state.comment,
            seen: false
          })
          .then(res => {
            axios
              .get(`/users/comment/${this.props.user.concept_id}`)
              .then(res => {
                this.setState({
                  comments: res.data,
                  comment: ""
                });
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };

  handleClickEdit = e => {
    axios
      .get(`/users/getsinglecomment/${e.target.id}`)
      .then(res => {
        this.setState({
          comment: res.data[0].comment,
          comment_id: res.data[0].comment_id
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleClickEditConcept = (e) => {
    <Redirect push to="/cl/editConcept/:concept_id" />
  }

  handleClickDelete = (e) => {
    axios
      .patch(`/users/deleteConceptSkills`, {
        concept_id: this.props.user.concept_id
      })
      .then( (res) => {
        axios
          .patch(`/users/deleteComments`, {
            concept_id: this.props.user.concept_id
          })
          .then( (res) => {
            axios
              .patch(`/users/deleteLikes`, {
                concept_id: this.props.user.concept_id
              })
              .then( (res) => {
                axios
                  .patch(`/users/deleteConcept`, {
                    concept_id: this.props.user.concept_id
                  })
                  .catch( (err) => {
                    console.log(err);
                  })
              })
              .catch( (err) => {
                console.log(err);
              })
          })
          .catch( (err) => {
            console.log(err);
          })
      })
      .catch( (err) => {
        console.log(err);
      })
  }


  render() {

    const {
      favorites_count,
      username,
      user_id,
      concept_name,
      description,
      ingredients,
      comments,
      is_favorite,
      comment,
      is_remote,
      location,
      concept_timestamp,
      skills
    } = this.state;
    console.log("concept_id: ", this.props.user.concept_id);
    let ts = new Date(concept_timestamp);
    let timestamp = ts.toDateString(ts);
    if (this.props.user) {
      return (
        <div>
          <Searchbar user={this.props.userinfo}/>
          <div className="singleRecipeContainer">
          <div className="recipeBox singleRecipePageBox">
            <div className="singleRecipeIntroLine">
              <h1 className="singleRecipeHeader"> {concept_name}</h1>
              <p>{description}</p>
              <p>{location}</p>
              <p>{is_remote?"remotely app":"no remote"}</p>
              <p>uploaded {timestamp}</p>
              <p className="recipeFavoritesCount">
                {" "}
                {!is_favorite? (
                <img
                  onClick={this.handleClickLike}
                  src="https://cdn0.iconfinder.com/data/icons/colourful-education/250/bulb-512.png"
                  title="Favorite"
                  className="heartIconFavorite"
                />
              ) : (
                <img
                  onClick={this.handleClickDisLike}
                  src="https://cdn0.iconfinder.com/data/icons/colourful-education/250/bulb-512.png"
                  className="heartIconUnfavorite"
                />
              )}
              <label className="favorites_count">{favorites_count}</label>
              </p>
              <div>
              <Link to={`/cl/profile/${this.props.user.user_id}`} className="singleRecipeUsernameLink">
              <img className="singleRecipeChefIcon" src="https://openclipart.org/download/247324/abstract-user-flat-1.svg" />
                <h3 className="singleRecipeUsername"> {username} </h3>{" "}
              </Link>
              </div>
            </div>
            <div className="singleRecipeButtons">
                <div class="mainButtons">
                <br/>
                { this.props.id === user_id?
                    <Link to={`/cl/${this.props.user.concept_id}`}><button id="edit_recipe" className="singleRecipeSubmit">Edit Recipe</button></Link>: ""
                }{" "}
                { this.props.id === user_id?
                  <Link to={`/cl/feed`}><button id="delete_recipe" className="singleRecipeSubmit" onClick={this.handleClickDelete}>Delete Recipe</button></Link>: ""
                }
                </div>
                <div>
                </div>

            </div>

            <div className="singleRecipeLeft">
              <h3 className="singleRecipeIngredientsTitle"> Wanted Skills </h3>
              <ul type="none">
                {skills? skills.map(skill => (
                      <li className="ingredientList" key={Math.random()}>
                        {skill.concept_skill}
                      </li>
                    )):""}
              </ul>
              <h3 className="singleRecipeIngredientsTitle">
                {" "}
                Leave a comment{" "}
              </h3>

              <form onSubmit={this.handleSubmit}>
                <textarea
                  placeholder="leave your comment"
                  onInput={this.handleInputComment}
                  value={comment}
                />
                <button className="singleRecipeSubmit">Submit</button>
              </form>

              <h3 className="singleRecipeIngredientsTitle"> Comments </h3>
              <ul className="commentList" type="none">
                {comments? comments.map(comment => (
                      <p key={Math.random()}>
                        <strong>
                          {comment.username}
                        </strong>
                        {": "}
                        {comment.comment}{" "}
                        {comment.user_id === this.props.id ? (
                        <button onClick={this.handleClickEdit} id={comment.comment_id} className="singleRecipeCommentEdit">
                          Edit/Delete
                        </button>)
                        :
                        ""}
                      </p>))
                  : "There are no any comments"}
              </ul>
            </div>
          </div>
        </div>
        </div>
      );
    } else {
      return <div>loading!</div>;
    }
  }
}
export default SingleConcept;
