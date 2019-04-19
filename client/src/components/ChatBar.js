import React, { Fragment, useContext } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Gravatar from "react-gravatar";
import produce from "immer";
import { reverse, sortBy } from "lodash";
import renderIf from "render-if";
import { ErrorMessage, Loading, NewConversation, Subscriber } from "components";
import { AuthContext, ChatContext } from "util/context";
import "./ChatBar.css";

export const GET_CONVERSATIONS = gql`
  {
    conversations {
      id
      title
      updatedAt
      users {
        id
        gravatarMd5
      }
    }
  }
`;

export const CONVERSATIONS_SUBSCRIPTION = gql`
  subscription onConversationCreated($userId: String!) {
    conversationCreated(userId: $userId) {
      id
      title
      updatedAt
      users {
        id
        gravatarMd5
      }
    }
  }
`;

export const CONVERSATIONS_UPDATE_SUBSCRIPTION = gql`
  subscription onConversationUpdated($userId: String!) {
    conversationUpdated(userId: $userId) {
      id
      title
      updatedAt
      users {
        id
        gravatarMd5
      }
    }
  }
`;

const ChatBar = () => {
  const { userId } = useContext(AuthContext);
  const { chatState, setChatState } = useContext(ChatContext);

  if (!userId) {
    return (
      <div className="p-2 empty-state">
        <h4>Chat</h4>
        <p>
          <Link to="/login">Log in</Link> to chat
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <h4 className="d-flex justify-content-between align-items-center">
        <span>{chatState === "creating" ? "New chat" : "Chat"}</span>
        {renderIf(chatState === "default")(
          <Button
            size="sm"
            variant="primary"
            onClick={() => setChatState("creating")}
          >
            New chat
          </Button>,
        )}
      </h4>
      <Query query={GET_CONVERSATIONS}>
        {({ client, loading, error, data, subscribeToMore }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorMessage message={error.message} />;
          const conversations = reverse(
            sortBy(data.conversations, "updatedAt"),
          );
          return (
            <Subscriber
              subscribeToNew={() => {
                subscribeToMore({
                  document: CONVERSATIONS_SUBSCRIPTION,
                  variables: { userId },
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newConversation =
                      subscriptionData.data.conversationCreated;
                    if (
                      prev.conversations.find(
                        (c) => c.id === newConversation.id,
                      )
                    )
                      return prev;
                    return produce(prev, (next) => {
                      next.conversations.unshift(newConversation);
                    });
                  },
                });
                subscribeToMore({
                  document: CONVERSATIONS_UPDATE_SUBSCRIPTION,
                  variables: {
                    userId,
                  },
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const updatedConversation =
                      subscriptionData.data.conversationUpdated;
                    return produce(prev, (next) => {
                      const match = prev.conversations.findIndex(
                        (c) => c.id === updatedConversation.id,
                      );
                      if (match !== -1) {
                        next.conversations[match] = updatedConversation;
                      }
                    });
                  },
                });
              }}
            >
              {renderIf(chatState === "creating")(<NewConversation />)}

              {renderIf(chatState === "default")(
                conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    to={`/chat/${conversation.id}`}
                    className="d-flex align-items-center p-2 chat"
                  >
                    <div className="d-flex chat-avatars">
                      {conversation.users
                        .filter((user) => user.id !== userId)
                        .slice(0, 3)
                        .map((user) => (
                          <div key={user.id} className="chat-avatar-wrapper">
                            <Gravatar
                              md5={user.gravatarMd5}
                              className="rounded-circle"
                              size={30}
                            />
                          </div>
                        ))}
                    </div>
                    <div className="chat-title">{conversation.title}</div>
                  </Link>
                )),
              )}
            </Subscriber>
          );
        }}
      </Query>
    </Fragment>
  );
};

export default ChatBar;
