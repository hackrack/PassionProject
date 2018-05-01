import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router"
import axios from "axios";
import Searchbar from "../Search/SearchBar";
// import "./Recipe.css";


class SingleConcept extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites_count: "",
      username: "",
      user_id: "",
      recipe_name: "",
      recipe: "",
      img: "",
      isvegeterian: "",
      isvegan: "",
      comments: "",
      ingredients: [],
      canFavorite: true,
      comment: "",
      comments_id: false,
      fork: "",
      forkedFrom: "",
      forked: false,
      forkList: [],
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
    const { username, forkedFrom, forkList } = this.state
    axios
      .get(`/users/singlerecipe/${this.props.user.recipeID}`)
      .then(res => {
        this.setState({
          favorites_count: res.data[0].favorites_count,
          username: res.data[0].username,
          user_id: res.data[0].user_id,
          recipe_name: res.data[0].recipe_name,
          recipe: res.data[0].recipe,
          img: res.data[0].img,
          isvegeterian: res.data[0].isvegeterian,
          isvegan: res.data[0].isvegan,
          fork: res.data[0].fork,
          forkedFrom: res.data[0].forkedfrom
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
          .get(`/users/isfavorite/${this.props.user.recipeID}`)
          .then(res => {
            if (res.data.length === 0) {
              this.setState({
                canFavorite: false
              });
            } else {
              this.setState({
                canFavorite: true
              });
            }
          })
      })
      .then(() => {
        axios
        .get(`/users/getingredients/${this.props.user.recipeID}`)
        .then(res => {
          this.setState({
            ingredients: res.data
          });
        })
      })
      .then((user) => {
        axios
        .get(`/users/comment/${this.props.user.recipeID}`)
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
      .then(() => {
        axios
          .get(`/users/getforkedrecipes/${this.props.user.recipeID}`)
          .then(res => {
            this.setState({
              forkList: res.data
            })
          })
      })
      .catch(error => {
        console.log("error in Recipe componentDidMount: ", error);
      });
    }


  handleClickLike = e => {
    e.preventDefault();
    const { username, forkedFrom, forkList } = this.state
    axios
      .post("/users/favorite", {
        recipe_id: this.props.user.recipeID,
        seen: false
      })
      .then(() => {
        this.setState({
          canFavorite: true
        });
      })
      .then(() =>
        axios
          .get(`/users/singlerecipe/${this.props.user.recipeID}`)
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
        recipe_id: this.props.user.recipeID
      })
      .then(() => {
        this.setState({
          canFavorite: false
        });
      })
      .then(() =>
        axios
          .get(`/users/singlerecipe/${this.props.user.recipeID}`)
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
    if (this.state.comments_id) {
      axios
        .patch(`/users/editComment/${this.state.comments_id}`, {
          recipe_id: this.props.user.recipeID,
          comment: this.state.comment
        })
        .then(res => {
          axios
            .get(`/users/comment/${this.props.user.recipeID}`)
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
            recipe_id: this.props.user.recipeID,
            comment: this.state.comment,
            seen: true
          })
          .then(res => {
            axios
              .get(`/users/comment/${this.props.user.recipeID}`)
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
            recipe_id: this.props.user.recipeID,
            comment: this.state.comment,
            seen: false
          })
          .then(res => {
            axios
              .get(`/users/comment/${this.props.user.recipeID}`)
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
          comments_id: res.data[0].comments_id
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleClickEditRecipe = (e) => {
    <Redirect push to="/cb/editRecipe/:recipeID" />
  }

  handleClickDelete = (e) => {
    axios
      .patch(`/users/deleteIngredients`, {
        recipe_id: this.props.user.recipeID
      })
      .then( (res) => {
        axios
          .patch(`/users/deleteComments`, {
            recipe_id: this.props.user.recipeID
          })
          .then( (res) => {
            axios
              .patch(`/users/deleteFavorites`, {
                recipe_id: this.props.user.recipeID
              })
              .then( (res) => {
                axios
                  .patch(`/users/deleteRecipe`, {
                    recipe_id: this.props.user.recipeID
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

  handleSubmitFork = (e) => {
    e.preventDefault();
    const { recipe_name,
            recipe,
            description,
            ingredients,
            ingredientsList,
            isvegeterian,
            isvegan,
            img,
            recipe_id,
            fork,
            username,
            forkedFrom } = this.state
    axios
      .post('/users/addRecipe', {
        recipe_name: recipe_name,
        description: description,
        recipe: recipe,
        img: img,
        isvegeterian: isvegeterian,
        isvegan: isvegan,
        fork: fork,
        forkedFrom: username,
        forkedID: this.props.user.recipeID
      })
      .then(res => {
        this.setState({
          recipe_id: res.data.recipe_id
        })
        axios
          .post(`/users/addIngredients/${res.data.recipe_id}`, {
            ingredients: ingredients
          })
      })
      .then( () => {
        this.setState({
          forked: true
        })
      })
      .catch(err => {
        this.setState({
          message: "Error posting new image"
        })
      })
  }


  render() {

    const {
      favorites_count,
      username,
      user_id,
      recipe_name,
      recipe,
      img,
      isvegeterian,
      isvegan,
      ingredients,
      comments,
      canFavorite,
      comment,
      fork,
      forked,
      forkedFrom,
      forkList
    } = this.state;
    console.log("CONCEPT FUNCTION: ", this.props.user.user_id);
    if (this.props.user) {
      return (
        <div>
          <Searchbar user={this.props.userinfo}/>
          <div className="singleRecipeContainer">
          <div className="recipeBox singleRecipePageBox">
            <div className="singleRecipeIntroLine">
              <h1 className="singleRecipeHeader"> {recipe_name} </h1>
              <p className="recipeFavoritesCount">
                {" "}
                {this.state.favorites_count}
              </p>
              <div>
              <Link to={`/cl/profile/${this.props.user.user_id}`} className="singleRecipeUsernameLink">
              <img className="singleRecipeChefIcon" src="https://cdn0.iconfinder.com/data/icons/kitchen-and-cooking/512/salting_cooking_hand_sprinkle_salt_flat_design_icon-256.png" />
                <h3 className="singleRecipeUsername"> {username} </h3>{" "}
              </Link>
              </div>
            </div>
            <div className="singleRecipeButtons">
                <div class="mainButtons">
                <br/>
                { this.props.id === user_id?
                  <Link to={`/cb/editRecipe/${this.props.user.recipeID}`}><button id="edit_recipe" className="singleRecipeSubmit">Edit Recipe</button></Link>: ""
                }{" "}
                { this.props.id === user_id?
                  <Link to={`/cb/feed`}><button id="delete_recipe" className="singleRecipeSubmit" onClick={this.handleClickDelete}>Delete Recipe</button></Link>: ""
                }
                { this.props.id !== user_id? (fork?
                  <button className="singleRecipeSubmit" onClick={this.handleSubmitFork}>Fork</button>
                : ""): ""}
                </div>
                <div>
                </div>

            </div>

            <div className="singleRecipeLeft">
              <h3 className="singleRecipeIngredientsTitle"> Ingredients </h3>
              <ul type="none">
                {ingredients? ingredients.map(ingredient => (
                      <li className="ingredientList" key={Math.random()}>
                        {ingredient.amount} {ingredient.name}
                      </li>
                    ))
                  :"There are no any ingredients"}
              </ul>

              <h3 className="singleRecipeIngredientsTitle">Directions</h3>
              <p> {recipe}</p>
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
                {comments
                  ? comments.map(comment => (
                      <p key={Math.random()}>
                        <strong>
                          {comment.username}
                        </strong>
                        {": "}
                        {comment.comment}{" "}
                        {comment.user_id === this.props.id ? (
                        <button onClick={this.handleClickEdit} id={comment.comments_id} className="singleRecipeCommentEdit">
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
