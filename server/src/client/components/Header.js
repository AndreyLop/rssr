import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const Header = ({ auth }) => {
  const AuthButton = auth ? (
    //api here so these requests wil be proxied by render server
    <a href="/api/logout">Logout</a>
  ) : (
    <a href="/api/auth/google">Login</a>
  );

  return (
    <nav>
      <div className="nav-wrapper">
        <Link className="brand-logo" to="/">
          React SSR
        </Link>
        <ul className="right">
          <li>
            {" "}
            <Link to="/users">Users</Link>
          </li>
          <li>
            {" "}
            <Link to="/admins">Admins</Link>
          </li>
          <li> {AuthButton}</li>
        </ul>
      </div>
    </nav>
  );
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps)(Header);
