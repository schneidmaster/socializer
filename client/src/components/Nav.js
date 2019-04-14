import React, { useContext } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import AuthContext from "util/authContext";

const GET_USER_INFO = gql`
  {
    currentUser {
      name
    }
  }
`;

const AppNav = ({ history }) => {
  const { token, setAuth } = useContext(AuthContext);

  if (token) {
    return (
      <Query query={GET_USER_INFO}>
        {({ client, loading, error, data }) => {
          if (error && error.graphQLErrors[0].message === "Unauthenticated") {
            setAuth(null);
          }

          return (
            <Navbar bg="primary" variant="dark" className="mb-4">
              <Link to="/app" className="navbar-brand">
                Socializer
              </Link>

              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Nav>
                  <NavDropdown
                    title={loading ? "User" : data.currentUser.name}
                    id="profile-dropdown"
                  >
                    <NavDropdown.Item onClick={() => setAuth(null)}>
                      Log out
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          );
        }}
      </Query>
    );
  } else {
    return (
      <Navbar bg="primary" variant="dark" className="mb-4">
        <Link to="/" className="navbar-brand">
          Socializer
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Link to="/login" className="nav-link" role="button">
              Log in
            </Link>
            <Link to="/signup" className="nav-link" role="button">
              Sign up
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
};

export default withRouter(AppNav);
