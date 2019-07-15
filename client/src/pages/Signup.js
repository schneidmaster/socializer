import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import gql from "graphql-tag";
import { Redirect } from "react-router-dom";
import renderIf from "render-if";
import { AuthContext } from "util/context";
import { errorHash } from "util/errors";

export const SIGNUP = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
      id
      token
    }
  }
`;

const useErrors = () => {
  const [errors, setErrors] = useState({});

  const clearError = (field) =>
    setErrors(Object.assign(errors, { [field]: null }));

  return [errors, setErrors, clearError];
};

const Signup = () => {
  const { token, setAuth } = useContext(AuthContext);
  const [errors, setErrors, clearError] = useErrors();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, { data, loading }] = useMutation(SIGNUP, {
    onError: (error) => setErrors(errorHash(error)),
  });

  if (data) {
    const {
      signUp: { id, token },
    } = data;
    setAuth({ id, token });
  }

  if (token) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Socializer | Sign up</title>
        <meta property="og:title" content="Socializer | Sign up" />
      </Helmet>

      <Container>
        <Row>
          <Col md={6} xs={12}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                signUp({
                  variables: {
                    name,
                    email,
                    password,
                  },
                });
              }}
            >
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  placeholder="Joe Smith"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  isInvalid={Boolean(errors.name)}
                />
                {renderIf(errors.name)(
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>,
                )}
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  isInvalid={Boolean(errors.email)}
                />
                {renderIf(errors.email)(
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
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
                    clearError("password");
                  }}
                  isInvalid={Boolean(errors.password)}
                />
                {renderIf(errors.password)(
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>,
                )}
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;
