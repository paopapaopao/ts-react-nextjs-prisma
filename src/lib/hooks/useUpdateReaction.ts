'use client';

import { type Post } from '@prisma/client';
import {
  type InfiniteData,
  type QueryClient,
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

type TVariables = {
  id: string;
  payload: ReactionSchema;
};

type TContext =
  | {
      previousComments: InfiniteData<TComments, number | null> | undefined;
    }
  | {
      previousPost: TPost | undefined;
      previousPosts: InfiniteData<TPosts, number | null> | undefined;
    };

const useUpdateReaction = (parentCommentId?: number | null | undefined) => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: TVariables) => {
      const response: Response = await fetch(`/api/reactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      return await response.json();
    },
    onMutate: async ({
      id,
      payload,
    }: TVariables): Promise<TContext | undefined> => {
      if (payload.postId === null) {
        const queryKey: (QueryKey | null | undefined)[] =
          parentCommentId === undefined
            ? [QueryKey.REPLIES, payload.postId, parentCommentId]
            : [QueryKey.COMMENTS, payload.postId];

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
                          comment?.userReaction.id === id &&
                          comment?.id === payload.commentId &&
                          comment?.userId === payload.userId
                        ) {
                          return {
                            ...comment,
                            userReaction: { ...comment.userReaction, payload },
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
                          post?.userReaction.id === id &&
                          post?.id === payload.postId &&
                          post?.userId === payload.userId
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

        // TODO: setQueryData for [QueryKey.POSTS, payload.postId];

        return { previousPosts, previousPost };
      }
    },
    onError: (
      _error,
      { payload }: TVariables,
      context: TContext | undefined
    ): void => {
      if (
        context &&
        'previousPosts' in context &&
        context.previousPosts !== undefined &&
        'previousPost' in context &&
        context.previousPost !== undefined
      ) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);

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
        queryClient.setQueryData(
          [QueryKey.COMMENTS, payload.postId],
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

export default useUpdateReaction;
