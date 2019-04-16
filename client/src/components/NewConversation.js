import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import cx from "classnames";
import { ChatContext } from "util/context";
import classes from "./NewConversation.module.css";

const NewConversation = () => {
  const { setChatState } = useContext(ChatContext);

  return (
    <div className={cx(classes.newConversation, "p-2")}>
      <p>New</p>
      <div className="d-flex justify-content-between">
        <Button variant="danger" onClick={() => setChatState("default")}>
          Cancel
        </Button>

        <Button variant="primary">Create</Button>
      </div>
    </div>
  );
};

export default NewConversation;
