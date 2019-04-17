import React, { Fragment, useContext } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import renderIf from "render-if";
import { AuthContext } from "util/context";

const GET_USER_INFO = gql`
  {
    currentUser {
      name
    }
  }
`;

const AppNav = () => {
  const { token, setAuth } = useContext(AuthContext);

  return (
    <Navbar bg="primary" variant="dark" className="mb-4">
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
            {renderIf(token)(
              <Query query={GET_USER_INFO}>
                {({ client, loading, error, data }) => {
                  if (
                    error &&
                    error.graphQLErrors[0].message === "Unauthenticated"
                  ) {
                    setAuth(null);
                    return null;
                  }

                  return (
                    <NavDropdown
                      title={loading ? "User" : data.currentUser.name}
                      id="profile-dropdown"
                    >
                      <NavDropdown.Item onClick={() => setAuth(null)}>
                        Log out
                      </NavDropdown.Item>
                    </NavDropdown>
                  );
                }}
              </Query>,
            )}

            {renderIf(!token)(
              <Fragment>
                <Link to="/login" className="nav-link" role="button">
                  Log in
                </Link>
                <Link to="/signup" className="nav-link" role="button">
                  Sign up
                </Link>
              </Fragment>,
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNav;
