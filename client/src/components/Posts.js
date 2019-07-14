import React, { Fragment, useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
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
  const { loading, error, data, subscribeToMore } = useQuery(GET_POSTS);
  const subscribeToNew = useCallback(
    () =>
      subscribeToMore({
        document: POSTS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newPost = subscriptionData.data.postCreated;

          // Check that we don't already have the
          // post stored.
          if (prev.posts.find((post) => post.id === newPost.id)) {
            return prev;
          }

          return produce(prev, (next) => {
            next.posts.unshift(newPost);
          });
        },
      }),
    [subscribeToMore],
  );

  let content;
  if (loading) {
    content = <Loading />;
  } else if (error) {
    content = <ErrorMessage message={error.message} />;
  } else {
    content = (
      <Feed
        feedType="post"
        items={data.posts}
        subscribeToNew={subscribeToNew}
      />
    );
  }

  return (
    <Fragment>
      <h4>Feed</h4>
      {content}
    </Fragment>
  );
};

export default Posts;
