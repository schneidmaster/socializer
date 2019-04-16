import React, { Fragment, useContext, useState } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Button, Card, Form } from "react-bootstrap";
import Gravatar from "react-gravatar";
import cx from "classnames";
import { ErrorMessage, Loading, Subscriber } from "components";
import AuthContext from "util/authContext";
import classes from "./Conversation.module.css";

const GET_CONVERSATION = gql`
  query GetConversation($id: String!) {
    conversation(id: $id) {
      id
      title
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
  const { userId } = useContext(AuthContext);
  const [body, setBody] = useState("");

  return (
    <Fragment>
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
                    prev.conversation.messages.push(newMessage);
                    return prev;
                  },
                })
              }
            >
              <h5>{data.conversation.title}</h5>
              <hr />
              {data.conversation.messages.map((message, idx) => (
                <div
                  key={message.id}
                  className={cx("d-flex", {
                    [classes.chatSelf]: message.user.id === String(userId),
                    [classes.chatOthers]: message.user.id !== String(userId),
                  })}
                >
                  <div
                    className={cx("d-flex", "mb-1", classes.chatBubbleWrapper)}
                  >
                    {idx === 0 ||
                    data.conversation.messages[idx - 1].user.id !==
                      message.user.id ? (
                      <Gravatar
                        md5={message.user.gravatarMd5}
                        className="rounded-circle mt-1"
                        size={30}
                      />
                    ) : (
                      <div className={classes.avatarSpacer} />
                    )}
                    <div className={cx("p-2", classes.chatBubble)}>
                      {message.body}
                    </div>
                  </div>
                </div>
              ))}
            </Subscriber>
          );
        }}
      </Query>

      <Mutation mutation={CREATE_MESSAGE} onCompleted={() => setBody("")}>
        {(submit, { data, loading, error }) => {
          return (
            <Card className="mt-2">
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
