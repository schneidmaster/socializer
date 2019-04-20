import React, { useContext, useState } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import { ErrorMessage } from "components";
import { ChatContext } from "util/context";
import "./NewConversation.css";

export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      id
      name
      gravatarMd5
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($userIds: [String]!) {
    createConversation(userIds: $userIds) {
      id
    }
  }
`;

const NewConversation = () => {
  const { setChatState } = useContext(ChatContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  return (
    <div className="new-conversation p-2">
      <Query query={SEARCH_USERS} variables={{ searchTerm }}>
        {({ client, loading, error, data, subscribeToMore }) => {
          if (error) return <ErrorMessage message={error.message} />;
          return (
            <Select
              isLoading={loading}
              isMulti
              inputValue={searchTerm}
              placeholder="Select users..."
              value={users}
              onChange={(value) => setUsers(value)}
              onInputChange={(value) => setSearchTerm(value)}
              options={
                data.searchUsers &&
                data.searchUsers.map((user) => ({
                  label: user.name,
                  value: user.id,
                }))
              }
            />
          );
        }}
      </Query>
      <div className="d-flex justify-content-between mt-2">
        <Button variant="danger" onClick={() => setChatState("default")}>
          Cancel
        </Button>

        <Mutation mutation={CREATE_CONVERSATION}>
          {(create, { data, loading, error }) => {
            if (data) {
              setChatState("default");
              return <Redirect to={`/chat/${data.createConversation.id}`} />;
            }
            return (
              <Button
                variant="primary"
                disabled={loading}
                onClick={() =>
                  create({
                    variables: { userIds: users.map((user) => user.value) },
                  })
                }
              >
                {loading ? "Creating..." : "Create"}
              </Button>
            );
          }}
        </Mutation>
      </div>
    </div>
  );
};

export default NewConversation;
