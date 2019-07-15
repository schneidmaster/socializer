import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import renderIf from "render-if";
import { AuthContext } from "util/context";

export const GET_USER_INFO = gql`
  query GetUserInfo {
    currentUser {
      name
    }
  }
`;

const AuthNav = () => {
  const { loading, error, data } = useQuery(GET_USER_INFO);
  const { setAuth } = useContext(AuthContext);

  if (error) {
    if (
      error.graphQLErrors[0] &&
      error.graphQLErrors[0].message === "Unauthenticated"
    ) {
      setAuth(null);
    }
    return null;
  }

  if (data && !data.currentUser) {
    return null;
  }

  return (
    <NavDropdown
      title={loading ? "User" : data.currentUser.name}
      id="profile-dropdown"
    >
      <NavDropdown.Item onClick={() => setAuth(null)}>Log out</NavDropdown.Item>
    </NavDropdown>
  );
};

const AppNav = () => {
  const { token } = useContext(AuthContext);

  return (
    <Navbar bg="primary" variant="dark" className="mb-4" fixed="top">
      <Container>
        <Link to="/" className="navbar-brand">
          Socializer
        </Link>

        {renderIf(token)(
          <Nav>
            <Link to="/" className="nav-link" role="button">
              Feed
            </Link>
            <Link to="/chat" className="nav-link" role="button">
              Chat
            </Link>
          </Nav>,
        )}

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {renderIf(token)(<AuthNav />)}

            {renderIf(!token)(
              <>
                <Link to="/login" className="nav-link" role="button">
                  Log in
                </Link>
                <Link to="/signup" className="nav-link" role="button">
                  Sign up
                </Link>
              </>,
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNav;
