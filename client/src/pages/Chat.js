import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch } from "react-router-dom";
import cx from "classnames";
import { ChatBar, Conversation } from "components";
import { AuthContext } from "util/context";
import "./Chat.css";

const ChatEmptyMessage = () => (
  <p>Select a conversation from the sidebar to begin chatting</p>
);

const Chat = ({
  match: {
    params: { id },
  },
}) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Socializer | Chat</title>
        <meta property="og:title" content="Socializer | Chat" />
      </Helmet>

      <Container>
        <Row className="chat-row">
          <Col
            xs={id ? 0 : 12}
            md={4}
            className={cx("chat-col", { "d-none d-md-block": id })}
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
    </>
  );
};

export default Chat;
