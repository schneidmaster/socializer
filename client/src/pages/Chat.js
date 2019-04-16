import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import cx from "classnames";
import { ChatBar, Conversation } from "components";
import classes from "./Chat.module.css";

const ChatEmptyMessage = () => (
  <p>Select a conversation from the sidebar to begin chatting</p>
);

const Chat = ({
  match: {
    params: { id },
  },
}) => {
  return (
    <Container>
      <Row className={classes.chatRow}>
        <Col
          xs={id ? 0 : 12}
          md={4}
          className={cx({ "d-none d-md-block": id })}
        >
          <ChatBar />
        </Col>
        <Col
          xs={id ? 12 : 0}
          md={8}
          className={cx(classes.chatCol, { "d-none d-md-block": !id })}
        >
          <Switch>
            <Route path="/chat/:id" component={Conversation} />
            <Route component={ChatEmptyMessage} />
          </Switch>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
