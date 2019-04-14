import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Container } from "react-bootstrap";
import { ErrorMessage, Feed, Loading } from "components";

const GET_POSTS = gql`
  {
    posts {
      id
      body
      insertedAt
      user {
        id
        name
        gravatarMd5
      }
    }
  }
`;

const POSTS_SUBSCRIPTION = gql`
  subscription onPostCreated {
    postCreated {
      id
      body
      insertedAt
      user {
        id
        name
        gravatarMd5
      }
    }
  }
`;

const Home = () => {
  return (
    <Container>
      <Query query={GET_POSTS}>
        {({ client, loading, error, data, subscribeToMore }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorMessage message={error.message} />;
          return (
            <Feed
              feedType="post"
              items={data.posts}
              subscribeToNew={() =>
                subscribeToMore({
                  document: POSTS_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newPost = subscriptionData.data.postCreated;

                    return Object.assign({}, prev, {
                      posts: [newPost, ...prev.posts],
                    });
                  },
                })
              }
            />
          );
        }}
      </Query>
    </Container>
  );
};

export default Home;
