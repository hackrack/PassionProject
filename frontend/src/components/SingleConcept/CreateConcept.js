import React, { Component } from "react";
import Searchbar from "../Search/SearchBar";

class CreateConcept extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Searchbar user={this.props.user} />
        <h1>CreateConcept</h1>
      </div>
    )
  }
}
export default CreateConcept;
