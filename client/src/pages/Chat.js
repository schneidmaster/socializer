import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
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
        <Col xs={id ? 0 : 12} md={4}>
          <ChatBar />
        </Col>
        <Col xs={id ? 12 : 0} md={8} className={classes.chatCol}>
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
