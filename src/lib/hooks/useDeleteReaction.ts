'use client';

import { type Reaction } from '@prisma/client';
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
  TComments,
  TPost,
  TPosts,
} from '../types';

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

type Props = {
  parentCommentId: number | null | undefined;
  postId: number | undefined;
};

const useDeleteReaction = ({
  parentCommentId,
  postId,
}: Props): UseMutationResult<TReaction, Error, string, TContext> => {
  const queryClient: QueryClient = useQueryClient();

  const queryKey: (QueryKey | number | null | undefined)[] =
    parentCommentId === null
      ? [QueryKey.COMMENTS, postId]
      : [QueryKey.REPLIES, postId, parentCommentId];

  return useMutation({
    mutationFn: async (id: string): Promise<TReaction> => {
      const response: Response = await fetch(`/api/reactions/${id}`, {
        method: 'DELETE',
      });

      return await response.json();
    },
    onMutate: async (id: string): Promise<TContext | undefined> => {
      const isPostReaction: boolean = parentCommentId === undefined;

      if (isPostReaction) {
        await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });

        await queryClient.cancelQueries({
          queryKey: [QueryKey.POSTS, postId],
        });

        const previousPosts = queryClient.getQueryData<
          InfiniteData<TPosts, number | null>
        >([QueryKey.POSTS]);

        const previousPost = queryClient.getQueryData<TPost>([
          QueryKey.POSTS,
          postId,
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
                  userReaction: null,
                },
              },
            };
          }
        );

        return { previousPosts, previousPost };
      } else {
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
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
};

export default useDeleteReaction;
