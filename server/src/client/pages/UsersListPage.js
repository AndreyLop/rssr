import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUsers } from "../actions";

class UsersList extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  renderUsers() {
    return this.props.users.map(user => {
      return <li key={user.id}>{user.name}</li>;
    });
  }

  render() {
    return <ul>{this.renderUsers()}</ul>;
  }
}

const mapStateToProps = state => {
  return {
    users: state.users
  };
};

const mapDispatchStateToProps = { fetchUsers };

//This function is used to fetch users by server for SSR
export const loadData = store => {
  return store.dispatch(fetchUsers());
};

export default {
  loadData,
  component: connect(
    mapStateToProps,
    mapDispatchStateToProps
  )(UsersList)
};
