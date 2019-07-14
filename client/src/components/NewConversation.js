import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
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
  const {
    loading: searchLoading,
    error: searchError,
    data: searchData,
  } = useQuery(SEARCH_USERS, {
    variables: { searchTerm },
  });
  const [create, { data, loading }] = useMutation(CREATE_CONVERSATION);
  if (data) {
    setChatState("default");
    return <Redirect to={`/chat/${data.createConversation.id}`} />;
  }

  let content;
  if (searchError) {
    content = <ErrorMessage message={searchError.message} />;
  } else {
    content = (
      <Select
        isLoading={searchLoading}
        isMulti
        inputValue={searchTerm}
        placeholder="Select users..."
        value={users}
        onChange={(value) => setUsers(value)}
        onInputChange={(value) => setSearchTerm(value)}
        options={
          searchData.searchUsers &&
          searchData.searchUsers.map((user) => ({
            label: user.name,
            value: user.id,
          }))
        }
      />
    );
  }

  return (
    <div className="new-conversation p-2">
      {content}
      <div className="d-flex justify-content-between mt-2">
        <Button variant="danger" onClick={() => setChatState("default")}>
          Cancel
        </Button>

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
      </div>
    </div>
  );
};

export default NewConversation;
