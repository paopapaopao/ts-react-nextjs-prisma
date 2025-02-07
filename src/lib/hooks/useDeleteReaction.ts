'use client';

import {
  type InfiniteData,
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  CommentWithRelationsAndRelationCountsAndUserReaction,
  PostWithRelationsAndRelationCountsAndUserReaction,
  TCommentInfiniteQuery,
  TPostMutation,
  TPostInfiniteQuery,
  TReactionMutation,
} from '../types';

type TContext =
  | {
      previousComments:
        | InfiniteData<TCommentInfiniteQuery, number | null>
        | undefined;
    }
  | {
      previousPost: TPostMutation | undefined;
      previousPosts:
        | InfiniteData<TPostInfiniteQuery, number | null>
        | undefined;
    };

type Props = {
  parentCommentId: number | null | undefined;
  postId: number | undefined;
};

const useDeleteReaction = ({
  parentCommentId,
  postId,
}: Props): UseMutationResult<TReactionMutation, Error, string, TContext> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<TReactionMutation> => {
      const response: Response = await fetch(`/api/reactions/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      return result.data;
    },
    onMutate: async (id: string): Promise<TContext | undefined> => {
      const isPostReaction: boolean = parentCommentId === undefined;

      if (isPostReaction) {
        await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });

        await queryClient.cancelQueries({
          queryKey: [QueryKey.POSTS, postId],
        });

        const previousPosts = queryClient.getQueryData<
          InfiniteData<TPostInfiniteQuery, number | null>
        >([QueryKey.POSTS]);

        const previousPost = queryClient.getQueryData<TPostMutation>([
          QueryKey.POSTS,
          postId,
        ]);

        queryClient.setQueryData(
          [QueryKey.POSTS],
          // TODO
          (oldPosts: InfiniteData<TPostInfiniteQuery> | undefined) => {
            if (oldPosts === undefined) {
              return oldPosts;
            }

            return {
              ...oldPosts,
              // TODO
              pages: oldPosts.pages.map((page: TPostInfiniteQuery) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    // TODO
                    posts: page.data?.posts.map(
                      (
                        post: PostWithRelationsAndRelationCountsAndUserReaction
                      ) => {
                        if (post?.userReaction?.id === id) {
                          return { ...post, userReaction: null };
                        }

                        return post;
                      }
                    ),
                  },
                };
              }),
            };
          }
        );

        queryClient.setQueryData(
          [QueryKey.POSTS, postId],
          // TODO
          (oldPost: TPostMutation | undefined) => {
            if (oldPost === undefined) {
              return oldPost;
            }

            return {
              ...oldPost,
              data: {
                ...oldPost.data,
                post: {
                  ...oldPost.data?.post,
                  userReaction: null,
                },
              },
            };
          }
        );

        return { previousPosts, previousPost };
      } else {
        const queryKey: (QueryKey | number | null | undefined)[] =
          parentCommentId === null
            ? [QueryKey.COMMENTS, postId]
            : [QueryKey.REPLIES, postId, parentCommentId];

        const previousComments =
          queryClient.getQueryData<
            InfiniteData<TCommentInfiniteQuery, number | null>
          >(queryKey);

        queryClient.setQueryData(
          queryKey,
          // TODO
          (oldComments: InfiniteData<TCommentInfiniteQuery> | undefined) => {
            if (oldComments === undefined) {
              return oldComments;
            }

            return {
              ...oldComments,
              // TODO
              pages: oldComments.pages.map((page: TCommentInfiniteQuery) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    // TODO
                    comments: page.data?.comments.map(
                      (
                        comment: CommentWithRelationsAndRelationCountsAndUserReaction
                      ) => {
                        if (comment?.userReaction?.id === id) {
                          return { ...comment, userReaction: null };
                        }

                        return comment;
                      }
                    ),
                  },
                };
              }),
            };
          }
        );

        return { previousComments };
      }
    },
    onError: (_error, _id, context: TContext | undefined): void => {
      if (
        context &&
        'previousPosts' in context &&
        context.previousPosts !== undefined
      ) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);
      }

      if (
        context &&
        'previousPost' in context &&
        context.previousPost !== undefined
      ) {
        queryClient.setQueryData(
          [QueryKey.POSTS, postId],
          context.previousPost
        );
      }

      if (
        context &&
        'previousComments' in context &&
        context.previousComments !== undefined
      ) {
        const queryKey: (QueryKey | number | null | undefined)[] =
          parentCommentId === null
            ? [QueryKey.COMMENTS, postId]
            : [QueryKey.REPLIES, postId, parentCommentId];

        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: (_data, _error, _id, context: TContext | undefined): void => {
      if (
        context &&
        'previousPosts' in context &&
        context.previousPosts !== undefined &&
        'previousPost' in context &&
        context.previousPost !== undefined
      ) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });

        queryClient.invalidateQueries({
          queryKey: [QueryKey.POSTS, postId],
        });
      }

      if (
        context &&
        'previousComments' in context &&
        context.previousComments !== undefined
      ) {
        const queryKey: (QueryKey | number | null | undefined)[] =
          parentCommentId === null
            ? [QueryKey.COMMENTS, postId]
            : [QueryKey.REPLIES, postId, parentCommentId];

        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
};

export default useDeleteReaction;
