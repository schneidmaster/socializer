import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Card, Form } from "react-bootstrap";
import "./NewMessage.css";

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($conversationId: String!, $body: String!) {
    createMessage(conversationId: $conversationId, body: $body) {
      id
    }
  }
`;

const NewMessage = ({ conversationId }) => {
  const [body, setBody] = useState("");

  const [submit] = useMutation(CREATE_MESSAGE, {
    onCompleted: () => setBody(""),
  });

  return (
    <Card className="new-message mt-2">
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
};

export default NewMessage;
