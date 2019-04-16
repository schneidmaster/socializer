import React, { Fragment, useContext, useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Gravatar from "react-gravatar";
import cx from "classnames";
import produce from "immer";
import { reverse, sortBy } from "lodash";
import renderIf from "render-if";
import { ErrorMessage, Loading, NewConversation, Subscriber } from "components";
import AuthContext from "util/authContext";
import classes from "./ChatBar.module.css";

const GET_CONVERSATIONS = gql`
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

const CONVERSATIONS_SUBSCRIPTION = gql`
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

const CONVERSATIONS_UPDATE_SUBSCRIPTION = gql`
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
  const [creating, setCreating] = useState(false);

  return (
    <Fragment>
      <h4 className="d-flex justify-content-between align-items-center">
        <span>{creating ? "New chat" : "Chat"}</span>
        {renderIf(!creating)(
          <Button size="sm" variant="primary" onClick={() => setCreating(true)}>
            New chat
          </Button>,
        )}
      </h4>

      {renderIf(creating)(
        <NewConversation onCancel={() => setCreating(false)} />,
      )}

      {renderIf(!creating)(
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
                {conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    to={`/chat/${conversation.id}`}
                    className={cx(
                      "d-flex",
                      "align-items-center",
                      "p-2",
                      classes.chat,
                    )}
                  >
                    <div className={cx("d-flex", classes.chatAvatars)}>
                      {conversation.users
                        .filter((user) => user.id !== userId)
                        .slice(0, 3)
                        .map((user) => (
                          <div
                            key={user.id}
                            className={classes.chatAvatarWrapper}
                          >
                            <Gravatar
                              md5={user.gravatarMd5}
                              className="rounded-circle"
                              size={30}
                            />
                          </div>
                        ))}
                    </div>
                    <div className={classes.chatTitle}>
                      {conversation.title}
                    </div>
                  </Link>
                ))}
              </Subscriber>
            );
          }}
        </Query>,
      )}
    </Fragment>
  );
};

export default ChatBar;
