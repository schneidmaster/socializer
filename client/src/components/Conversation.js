import React, { useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
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
  const { loading, error, data, subscribeToMore } = useQuery(GET_CONVERSATION, {
    variables: { id },
  });
  const subscribeToNew = useCallback(
    () =>
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
      }),
    [id],
  );

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <ErrorMessage message={error.message} />;
  } else {
    return (
      <Subscriber subscribeToNew={subscribeToNew}>
        <div className="chat-layout d-flex flex-column pb-4">
          <div className="chat-content d-flex flex-column">
            <h5>{data.conversation.title}</h5>
            <hr />
            <MessageThread messages={data.conversation.messages} />
          </div>

          <NewMessage conversationId={id} />
        </div>
      </Subscriber>
    );
  }
};

export default Conversation;
