import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Card, Form } from "react-bootstrap";

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($conversationId: String!, $body: String!) {
    createMessage(conversationId: $conversationId, body: $body) {
      id
    }
  }
`;

const NewMessage = ({ conversationId }) => {
  const [body, setBody] = useState("");

  return (
    <Mutation mutation={CREATE_MESSAGE} onCompleted={() => setBody("")}>
      {(submit, { data, loading, error }) => {
        return (
          <Card className="mt-2">
            <Card.Body>
              <Form
                data-testid="new-message"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit({
                    variables: { body, conversationId },
                  });
                }}
              >
                <Form.Group>
                  <Form.Control
                    rows="3"
                    placeholder="What's on your mind?"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        );
      }}
    </Mutation>
  );
};

export default NewMessage;
