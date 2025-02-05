'use client';

import { ReactionType } from '@prisma/client';
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
  ReactionSchema,
  TComments,
  TPost,
  TPosts,
  TReaction,
} from '../types';

type TContext =
  | {
      previousComments: InfiniteData<TComments, number | null> | undefined;
    }
  | {
      previousPost: TPost | undefined;
      previousPosts: InfiniteData<TPosts, number | null> | undefined;
    };

type Props = {
  parentCommentId: number | null | undefined;
  postId: number | undefined;
};

const mockReactionData = {
  id: 0,
  type: ReactionType.LIKE,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 0,
  clerkUserId: '',
  postId: 0,
  commentId: 0,
};

const useCreateReaction = ({
  parentCommentId,
  postId,
}: Props): UseMutationResult<TReaction, Error, ReactionSchema, TContext> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReactionSchema): Promise<TReaction> => {
      const response: Response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      return result.data;
    },
    onMutate: async (
      payload: ReactionSchema
    ): Promise<TContext | undefined> => {
      const isPostReaction: boolean = parentCommentId === undefined;
      const id: string = String(new Date());
      // TODO
      const reaction = { ...mockReactionData, ...payload, id };

      if (isPostReaction) {
        await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });

        await queryClient.cancelQueries({
          queryKey: [QueryKey.POSTS, payload.postId],
        });

        const previousPosts = queryClient.getQueryData<
          InfiniteData<TPosts, number | null>
        >([QueryKey.POSTS]);

        const previousPost = queryClient.getQueryData<TPost>([
          QueryKey.POSTS,
          payload.postId,
        ]);

        queryClient.setQueryData(
          [QueryKey.POSTS],
          // TODO
          (oldPosts: InfiniteData<TPosts> | undefined) => {
            if (oldPosts === undefined) {
              return oldPosts;
            }

            return {
              ...oldPosts,
              // TODO
              pages: oldPosts.pages.map((page: TPosts) => {
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
                          post?.userId === reaction.userId &&
                          post?.id === reaction.postId
                        ) {
                          return {
                            ...post,
                            userReaction: reaction,
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
          (oldPost: TPost | undefined) => {
            if (oldPost === undefined) {
              return oldPost;
            }

            return {
              ...oldPost,
              data: {
                ...oldPost.data,
                post: {
                  ...oldPost.data?.post,
                  userReaction: reaction,
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
          queryClient.getQueryData<InfiniteData<TComments, number | null>>(
            queryKey
          );

        queryClient.setQueryData(
          queryKey,
          // TODO
          (oldComments: InfiniteData<TComments> | undefined) => {
            if (oldComments === undefined) {
              return oldComments;
            }

            return {
              ...oldComments,
              // TODO
              pages: oldComments.pages.map((page: TComments) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    // TODO
                    comments: page.data.comments.map(
                      (
                        comment: CommentWithRelationsAndRelationCountsAndUserReaction
                      ) => {
                        if (
                          comment?.userId === reaction.userId &&
                          comment?.id === reaction.commentId
                        ) {
                          return {
                            ...comment,
                            userReaction: reaction,
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
    onError: (_error, _payload, context: TContext | undefined): void => {
      if (
        context &&
        'previousPosts' in context &&
        context.previousPosts !== undefined &&
        'previousPost' in context &&
        context.previousPost !== undefined
      ) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);

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
    onSettled: (
      _data,
      _error,
      _payload,
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

export default useCreateReaction;
