import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import produce from "immer";
import { ErrorMessage, Feed, Loading } from "components";

export const GET_POSTS = gql`
  query GetPosts {
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

export const POSTS_SUBSCRIPTION = gql`
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

const Posts = () => {
  return (
    <Fragment>
      <h4>Feed</h4>
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

                    return produce(prev, (next) => {
                      next.posts.unshift(newPost);
                    });
                  },
                })
              }
            />
          );
        }}
      </Query>
    </Fragment>
  );
};

export default Posts;
