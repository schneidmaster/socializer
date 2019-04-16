import React, { Fragment, useState } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Gravatar from "react-gravatar";
import cx from "classnames";
import { ErrorMessage, Loading, Subscriber } from "components";

const GET_CONVERSATION = gql`
  query GetConversation($id: String!) {
    conversation(id: $id) {
      id
      messages {
        id
        body
        user {
          id
          name
          gravatarMd5
        }
      }
    }
  }
`;

const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageCreated($conversationId: String!) {
    messageCreated(conversationId: $conversationId) {
      id
      body
      user {
        id
        name
        gravatarMd5
      }
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation CreateMessage($conversationId: String!, $body: String!) {
    createMessage(conversationId: $conversationId, body: $body) {
      id
    }
  }
`;

const Conversation = ({
  match: {
    params: { id },
  },
}) => {
  const [body, setBody] = useState("");

  return (
    <Fragment>
      <h4>Chat</h4>
      <Query query={GET_CONVERSATION} variables={{ id }}>
        {({ client, loading, error, data, subscribeToMore }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorMessage message={error.message} />;
          return (
            <Subscriber
              subscribeToNew={() =>
                subscribeToMore({
                  document: MESSAGES_SUBSCRIPTION,
                  variables: { conversationId: id },
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newMessage = subscriptionData.data.messageCreated;

                    prev.conversation.messages = [
                      newMessage,
                      ...prev.conversation.messages,
                    ];
                    return prev;
                  },
                })
              }
            >
              {data.conversation.messages.map((message) => (
                <div key={message.id}>{message.body}</div>
              ))}
            </Subscriber>
          );
        }}
      </Query>

      <Mutation mutation={CREATE_MESSAGE} onCompleted={() => setBody("")}>
        {(submit, { data, loading, error }) => {
          return (
            <Card className="mb-4">
              <Card.Body>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit({ variables: { body, conversationId: id } });
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
                </Form>
              </Card.Body>
            </Card>
          );
        }}
      </Mutation>
    </Fragment>
  );
};

export default Conversation;
