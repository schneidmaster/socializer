import React, { useCallback, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Gravatar from "react-gravatar";
import produce from "immer";
import { reverse, sortBy } from "lodash";
import renderIf from "render-if";
import { NewConversation, QueryResult } from "components";
import { Subscriber } from "containers";
import { AuthContext, ChatContext } from "util/context";
import "./ChatBar.css";

export const GET_CONVERSATIONS = gql`
  query GetConversations {
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
  subscription onConversationCreated {
    conversationCreated {
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
  subscription onConversationUpdated {
    conversationUpdated {
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

  if (userId) {
    return <AuthChatBar />;
  } else {
    return <UnauthChatBar />;
  }
};

const UnauthChatBar = () => {
  return (
    <div className="p-2 empty-state">
      <h4>Chat</h4>
      <p>
        <Link to="/login">Log in</Link> to chat
      </p>
    </div>
  );
};

const AuthChatBar = () => {
  const { userId } = useContext(AuthContext);
  const { chatState, setChatState } = useContext(ChatContext);
  const { subscribeToMore, ...queryResult } = useQuery(GET_CONVERSATIONS);
  const subscribeToNew = useCallback(() => {
    subscribeToMore({
      document: CONVERSATIONS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;

        // Check that we don't already have the
        // conversation stored.
        if (prev.conversations.find((c) => c.id === newConversation.id)) {
          return prev;
        }

        return produce(prev, (next) => {
          next.conversations.unshift(newConversation);
        });
      },
    });
    subscribeToMore({
      document: CONVERSATIONS_UPDATE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedConversation = subscriptionData.data.conversationUpdated;
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
  }, []);

  return (
    <div className="chat-bar sticky-top d-flex flex-column pb-4">
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

      <div className="chat-conversations d-flex flex-column">
        <QueryResult {...queryResult}>
          {({ data }) => (
            <Subscriber subscribeToNew={subscribeToNew}>
              {renderIf(chatState === "creating")(<NewConversation />)}

              {renderIf(chatState === "default")(
                reverse(sortBy(data.conversations, "updatedAt")).map(
                  (conversation) => (
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
                  ),
                ),
              )}
            </Subscriber>
          )}
        </QueryResult>
      </div>
    </div>
  );
};

export default ChatBar;
