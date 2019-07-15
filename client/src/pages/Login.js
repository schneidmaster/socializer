import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import gql from "graphql-tag";
import { Redirect } from "react-router-dom";
import renderIf from "render-if";
import { AuthContext } from "util/context";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    authenticate(email: $email, password: $password) {
      id
      token
    }
  }
`;

const Login = () => {
  const { token, setAuth } = useContext(AuthContext);
  const [isInvalid, setIsInvalid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN, {
    onError: () => setIsInvalid(true),
  });

  if (data) {
    const {
      authenticate: { id, token },
    } = data;
    setAuth({ id, token });
  }

  if (token) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Socializer | Log in</title>
        <meta property="og:title" content="Socializer | Log in" />
      </Helmet>
      <Container>
        <Row>
          <Col md={6} xs={12}>
            <Form
              data-testid="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                login({ variables: { email, password } });
              }}
            >
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsInvalid(false);
                  }}
                  isInvalid={isInvalid}
                />
                {renderIf(error)(
                  <Form.Control.Feedback type="invalid">
                    Email or password is invalid
                  </Form.Control.Feedback>,
                )}
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsInvalid(false);
                  }}
                  isInvalid={isInvalid}
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
