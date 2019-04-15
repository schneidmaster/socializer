import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Posts } from "components";

const Home = () => {
  return (
    <Container>
      <Row>
        <Col xs={12} md={8}>
          <Posts />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
