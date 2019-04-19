import React, { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Helmet from "react-helmet";
import { Route, Switch } from "react-router-dom";
import cx from "classnames";
import { ChatBar, Conversation } from "components";
import "./Chat.css";

const ChatEmptyMessage = () => (
  <p>Select a conversation from the sidebar to begin chatting</p>
);

const Chat = ({
  match: {
    params: { id },
  },
}) => {
  return (
    <Fragment>
      <Helmet>
        <title>Socializer | Chat</title>
        <meta property="og:title" content="Socializer | Chat" />
      </Helmet>

      <Container>
        <Row className="chat-row">
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
            className={cx("chat-col", { "d-none d-md-block": !id })}
          >
            <Switch>
              <Route path="/chat/:id" component={Conversation} />
              <Route component={ChatEmptyMessage} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Chat;
