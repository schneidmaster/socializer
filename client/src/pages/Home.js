import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Col, Container, Row } from "react-bootstrap";
import { ErrorMessage, Loading } from "components";
// import { Link } from "react-router-dom";

const GET_POSTS = gql`
  {
    posts {
      id
      body
      user {
        id
        name
      }
    }
  }
`;

const Home = () => {
  return (
    <Container>
      <Query query={GET_POSTS}>
        {({ client, loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorMessage message={error.message} />;
          return data.posts.map((post) => (
            <Row key={post.id}>
              <Col xs={6}>
                <strong>{post.user.name}</strong>
                {post.body}
              </Col>
            </Row>
          ));
        }}
      </Query>
    </Container>
  );
};

export default Home;
