import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const requireAuth = ChildComponent => {
  class Wrapper extends Component {
    render() {
      switch (this.props.auth) {
        case false:
          return <Redirect tp="/" />;
        case null:
          return <div>Loading</div>;
        default:
          return <ChildComponent {...this.props} />;
      }
    }
  }

  const mapStateToProps = ({ auth }) => ({
    auth
  });

  return connect(mapStateToProps)(Wrapper);
};

export default requireAuth;
