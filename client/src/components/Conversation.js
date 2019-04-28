import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import produce from "immer";
import { ErrorMessage, Loading, MessageThread, NewMessage } from "components";
import { Subscriber } from "containers";
import "./Conversation.css";

export const GET_CONVERSATION = gql`
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

export const MESSAGES_SUBSCRIPTION = gql`
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

const Conversation = ({
  match: {
    params: { id },
  },
}) => {
  return (
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

                  // Check that we don't already have the
                  // message stored.
                  if (
                    prev.conversation.messages.find(
                      (message) => message.id === newMessage.id,
                    )
                  ) {
                    return prev;
                  }

                  return produce(prev, (next) => {
                    next.conversation.messages.push(newMessage);
                  });
                },
              })
            }
          >
            <div className="d-flex chat-layout">
              <div className="d-flex chat-content">
                <h5>{data.conversation.title}</h5>
                <hr />
                <MessageThread messages={data.conversation.messages} />
              </div>

              <NewMessage conversationId={id} />
            </div>
          </Subscriber>
        );
      }}
    </Query>
  );
};

export default Conversation;
