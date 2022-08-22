import React, { Component } from "react";

class Result extends Component {
  render() {
    const result = this.props.results;

    if (!result) {
      return null;
    }

    return <li> {result.length} </li>;
  }
}

export default Result;
