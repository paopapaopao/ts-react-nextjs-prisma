'use client';

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import {
  CommentWithRelationsAndRelationCountsAndUserReaction,
  PostWithRelationsAndRelationCountsAndUserReaction,
} from '../types';

type TPosts = {
  data: {
    nextCursor: number | null;
    posts: PostWithRelationsAndRelationCountsAndUserReaction[];
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

type TComments = {
  data: {
    comments: CommentWithRelationsAndRelationCountsAndUserReaction[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const mutationFn = async (id: string) => {
  const response = await fetch(`/api/reactions/${id}`, { method: 'DELETE' });
  const data = await response.json();

  return data;
};

export const useDeleteReaction = (
  postId: number | undefined = undefined,
  parentCommentId: number | null | undefined = undefined
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (reactionId) => {
      let previousComments;
      let previousPosts;
      let previousPost;

      if (postId === null) {
        const queryKey =
          parentCommentId === undefined
            ? [QueryKey.COMMENTS, postId]
            : [QueryKey.REPLIES, postId, parentCommentId];

        previousComments = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(
          queryKey,
          (oldComments: InfiniteData<TComments>) => {
            return {
              ...oldComments,
              pages: oldComments.pages.map((page: TComments) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    comments: page.data.comments.map((comment) => {
                      if (comment?.userReaction.id === reactionId) {
                        return { ...comment, userReaction: null };
                      }

                      return comment;
                    }),
                  },
                };
              }),
            };
          }
        );
      } else {
        await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });
        // await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS, postId] });

        previousPosts = queryClient.getQueryData([QueryKey.POSTS]);
        // previousPost = queryClient.getQueryData([QueryKey.POSTS, postId]);

        queryClient.setQueryData(
          [QueryKey.POSTS],
          (oldPosts: InfiniteData<TPosts>) => {
            if (!oldPosts) {
              return oldPosts;
            }

            return {
              ...oldPosts,
              pages: oldPosts.pages.map((page: TPosts) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    posts: page.data.posts.map((post) => {
                      if (post?.userReaction.id === reactionId) {
                        return { ...post, userReaction: null };
                      }

                      return post;
                    }),
                  },
                };
              }),
            };
          }
        );
      }

      return { previousComments, previousPosts, previousPost };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.COMMENTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.REPLIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POST] });
    },
  });
};
