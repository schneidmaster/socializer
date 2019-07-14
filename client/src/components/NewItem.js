import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import renderIf from "render-if";
import { AuthContext } from "util/context";

export const CREATE_POST = gql`
  mutation CreatePost($body: String!) {
    createPost(body: $body) {
      id
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
    }
  }
`;

const NewItem = ({ feedType, params }) => {
  const { token } = useContext(AuthContext);
  const [body, setBody] = useState("");

  const mutation = feedType === "comment" ? CREATE_COMMENT : CREATE_POST;

  const [submit, { loading }] = useMutation(mutation, {
    onCompleted: () => setBody(""),
  });

  return (
    <Card className="mb-4">
      <Card.Body>
        {renderIf(token)(
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              submit({ variables: { body, ...params } });
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
            <Link to="/login">Log in</Link> to submit a {feedType}.
          </div>,
        )}
      </Card.Body>
    </Card>
  );
};

export default NewItem;
