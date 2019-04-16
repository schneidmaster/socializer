import React, { Fragment, useContext } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Gravatar from "react-gravatar";
import cx from "classnames";
import produce from "immer";
import { ErrorMessage, Loading, Subscriber } from "components";
import AuthContext from "util/authContext";
import classes from "./ChatBar.module.css";

const GET_CONVERSATIONS = gql`
  {
    conversations {
      id
      title
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
      users {
        id
        gravatarMd5
      }
    }
  }
`;

const ChatBar = () => {
  const { userId } = useContext(AuthContext);

  return (
    <Fragment>
      <h4>Chat</h4>
      <Query query={GET_CONVERSATIONS}>
        {({ client, loading, error, data, subscribeToMore }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorMessage message={error.message} />;
          return (
            <Subscriber
              subscribeToNew={() =>
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
                })
              }
            >
              {data.conversations.map((conversation) => (
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
                  <div className={classes.chatTitle}>{conversation.title}</div>
                </Link>
              ))}
            </Subscriber>
          );
        }}
      </Query>
    </Fragment>
  );
};

export default ChatBar;
