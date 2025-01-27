'use client';

import { type Post, type Reaction, ReactionType } from '@prisma/client';
import {
  type InfiniteData,
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import {
  type CommentWithRelationsAndRelationCountsAndUserReaction,
  type PostWithRelationsAndRelationCountsAndUserReaction,
  type ReactionSchema,
} from '../types';

type TComments = {
  data: {
    comments: CommentWithRelationsAndRelationCountsAndUserReaction[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

type TPost = {
  data: { post: Post | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

type TPosts = {
  data: {
    nextCursor: number | null;
    posts: PostWithRelationsAndRelationCountsAndUserReaction[];
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

type TReaction = {
  data: { reaction: Reaction | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

type TContext =
  | {
      previousComments: InfiniteData<TComments, number | null> | undefined;
    }
  | {
      previousPost: TPost | undefined;
      previousPosts: InfiniteData<TPosts, number | null> | undefined;
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

const useCreateReaction = (
  postId?: number | undefined,
  parentCommentId?: number | null | undefined
): UseMutationResult<TReaction, Error, ReactionSchema, TContext> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReactionSchema): Promise<TReaction> => {
      const response: Response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      return await response.json();
    },
    onMutate: async (
      payload: ReactionSchema
    ): Promise<TContext | undefined> => {
      if (payload.postId === null) {
        const queryKey: (QueryKey | number | null | undefined)[] =
          parentCommentId === undefined
            ? [QueryKey.REPLIES, payload.postId, parentCommentId]
            : [QueryKey.COMMENTS, postId];

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

            const id: number = Number(new Date());
            // TODO
            const reaction = { ...mockReactionData, ...payload, id };

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
                          comment?.id === reaction.commentId &&
                          comment?.userId === reaction.userId
                        ) {
                          return {
                            ...comment,
                            userReaction: {
                              ...comment.userReaction,
                              ...reaction,
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
      } else {
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

            const id: number = Number(new Date());
            // TODO
            const reaction = { ...mockReactionData, ...payload, id };

            return {
              ...oldPosts,
              // TODO
              pages: oldPosts.pages.map((page: TPosts) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    // TODO
                    posts: page.data.posts.map(
                      (
                        post: PostWithRelationsAndRelationCountsAndUserReaction
                      ) => {
                        if (
                          post?.id === reaction.postId &&
                          post?.userId === reaction.userId
                        ) {
                          return {
                            ...post,
                            userReaction: {
                              ...post.userReaction,
                              ...reaction,
                            },
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

        // TODO: setQueryData for [QueryKey.POSTS, payload.postId];

        return { previousPosts, previousPost };
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
        queryClient.setQueryData(
          [QueryKey.COMMENTS, postId],
          context.previousComments
        );
      }
    },
    onSettled: (): void => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.COMMENTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.REPLIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POST] });
    },
  });
};

export default useCreateReaction;
