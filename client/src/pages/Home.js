import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ChatBar, Posts } from "components";

const Home = () => {
  return (
    <Container>
      <Row>
        <Col md={4} className="d-none d-md-block">
          <ChatBar />
        </Col>
        <Col xs={12} md={8}>
          <Posts />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
