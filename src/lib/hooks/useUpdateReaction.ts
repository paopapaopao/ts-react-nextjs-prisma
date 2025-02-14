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
  CommentInfiniteQuery,
  CommentWithRelationsAndRelationCountsAndUserReaction,
  PostInfiniteQuery,
  PostMutation,
  PostWithRelationsAndRelationCountsAndUserReaction,
  ReactionMutation,
  ReactionVariables,
} from '../types';

type TContext =
  | {
      previousComments:
        | InfiniteData<CommentInfiniteQuery, number | null>
        | undefined;
    }
  | {
      previousPost: PostMutation | undefined;
      previousPosts: InfiniteData<PostInfiniteQuery, number | null> | undefined;
    };

type Props = {
  parentCommentId: number | null | undefined;
  postId: number | undefined;
};

const useUpdateReaction = ({
  parentCommentId,
  postId,
}: Props): UseMutationResult<
  ReactionMutation,
  Error,
  ReactionVariables,
  TContext
> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: ReactionVariables): Promise<ReactionMutation> => {
      const response: Response = await fetch(`/api/reactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      return result.data;
    },
    onMutate: async ({
      id,
      payload,
    }: ReactionVariables): Promise<TContext | undefined> => {
      const isPostReaction: boolean = parentCommentId === undefined;

      if (isPostReaction) {
        await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });

        await queryClient.cancelQueries({
          queryKey: [QueryKey.POSTS, payload.postId],
        });

        const previousPosts = queryClient.getQueryData<
          InfiniteData<PostInfiniteQuery, number | null>
        >([QueryKey.POSTS]);

        const previousPost = queryClient.getQueryData<PostMutation>([
          QueryKey.POSTS,
          payload.postId,
        ]);

        queryClient.setQueryData(
          [QueryKey.POSTS],
          // TODO
          (oldPosts: InfiniteData<PostInfiniteQuery> | undefined) => {
            if (oldPosts === undefined) {
              return oldPosts;
            }

            return {
              ...oldPosts,
              // TODO
              pages: oldPosts.pages.map((page: PostInfiniteQuery) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    // TODO
                    posts: page.data?.posts.map(
                      (
                        post: PostWithRelationsAndRelationCountsAndUserReaction
                      ) => {
                        if (
                          post?.userReaction?.id === id &&
                          post?.userId === payload.userId &&
                          post?.id === payload.postId
                        ) {
                          return {
                            ...post,
                            userReaction: { ...post.userReaction, ...payload },
                          };
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
          [QueryKey.POSTS, payload.postId],
          // TODO
          (oldPost: PostMutation | undefined) => {
            if (oldPost === undefined) {
              return oldPost;
            }

            return {
              ...oldPost,
              data: {
                ...oldPost.data,
                post: {
                  ...oldPost.data?.post,
                  userReaction: {
                    ...(oldPost.data?.post &&
                      'userReaction' in oldPost.data.post &&
                      oldPost.data.post.userReaction !== null && {
                        ...oldPost.data.post.userReaction,
                      }),
                    ...payload,
                  },
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
            InfiniteData<CommentInfiniteQuery, number | null>
          >(queryKey);

        queryClient.setQueryData(
          queryKey,
          // TODO
          (oldComments: InfiniteData<CommentInfiniteQuery> | undefined) => {
            if (oldComments === undefined) {
              return oldComments;
            }

            return {
              ...oldComments,
              // TODO
              pages: oldComments.pages.map((page: CommentInfiniteQuery) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    // TODO
                    comments: page.data?.comments.map(
                      (
                        comment: CommentWithRelationsAndRelationCountsAndUserReaction
                      ) => {
                        if (
                          comment?.userReaction?.id === id &&
                          comment?.userId === payload.userId &&
                          comment?.id === payload.commentId
                        ) {
                          return {
                            ...comment,
                            userReaction: {
                              ...comment.userReaction,
                              ...payload,
                            },
                          };
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
    onError: (
      _error,
      { payload }: ReactionVariables,
      context: TContext | undefined
    ): void => {
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
          [QueryKey.POSTS, payload.postId],
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
    onSettled: (
      _data,
      _error,
      { payload }: ReactionVariables,
      context: TContext | undefined
    ): void => {
      if (
        context &&
        'previousPosts' in context &&
        context.previousPosts !== undefined &&
        'previousPost' in context &&
        context.previousPost !== undefined
      ) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });

        queryClient.invalidateQueries({
          queryKey: [QueryKey.POSTS, payload.postId],
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

export default useUpdateReaction;
