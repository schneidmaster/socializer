import React, { useContext, useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import renderIf from "render-if";
import AuthContext from "util/authContext";

const CREATE_POST = gql`
  mutation CreatePost($body: String!) {
    createPost(body: $body) {
      id
    }
  }
`;

const NewPost = () => {
  const { token } = useContext(AuthContext);
  const [body, setBody] = useState("");

  return (
    <Mutation mutation={CREATE_POST}>
      {(submit, { data, loading, error }) => {
        if (data) {
          setBody("");
        }
        return (
          <Card className="mb-4">
            <Card.Body>
              {renderIf(token)(
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit({ variables: { body } });
                  }}
                >
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder="What's on your mind?"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Form>,
              )}
              {renderIf(!token)(
                <div className="text-muted h7">
                  <Link to="/login">Log in</Link> to submit a post.
                </div>,
              )}
            </Card.Body>
          </Card>
        );
      }}
    </Mutation>
  );
};

export default NewPost;
