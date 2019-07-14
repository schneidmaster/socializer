import React, { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { ChatBar, Posts } from "components";

const Home = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Socializer</title>
      </Helmet>
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
    </Fragment>
  );
};

export default Home;
