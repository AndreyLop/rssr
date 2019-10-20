import React, { Component } from "react";
import { connect } from "react-redux";

import requireAuth from "../components/HOC/requireAuth";
import { fetchAdmins } from "../actions";

class AdminsListPage extends Component {
  componentDidMount() {
    this.props.fetchAdmins();
  }

  renderAdmins() {
    return this.props.admins.map(admin => {
      return <li key={admin.id}>{admin.name}</li>;
    });
  }

  render() {
    return (
      <div>
        <h3>Protected List of Admins</h3>
        <ul>{this.renderAdmins()}</ul>;
      </div>
    );
  }
}

const mapStateToProps = ({ admins }) => {
  return {
    admins
  };
};

const mapDispatchStateToProps = { fetchAdmins };

//This function is used to fetch users by server for SSR
export const loadData = ({ dispatch }) => dispatch(fetchAdmins());

export default {
  loadData,
  component: connect(
    mapStateToProps,
    mapDispatchStateToProps
  )(requireAuth(AdminsListPage))
};
