'use client';

import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  PostSchema,
  PostWithRelationsAndRelationCountsAndUserReaction,
  TPostInfiniteQuery,
  TPostMutation,
  TPostQuery,
} from '../types';

type TVariables = {
  id: number | undefined;
  payload: PostSchema;
};

type TContext =
  | { previousPost: TPostQuery | undefined }
  | {
      previousPosts:
        | InfiniteData<TPostInfiniteQuery, number | null>
        | undefined;
    };

const useUpdatePost = (
  pathname: string
): UseMutationResult<TPostMutation, Error, TVariables, TContext> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: TVariables): Promise<TPostMutation> => {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result: TPostMutation = await response.json();

      if (!response.ok && result.errors !== null) {
        throw new Error(Object.values(result.errors).flat().join('. ').trim());
      }

      return result;
    },
    onMutate: async ({
      id,
      payload,
    }: TVariables): Promise<TContext | undefined> => {
      if (pathname === '/') {
        await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });

        const previousPosts = queryClient.getQueryData<
          InfiniteData<TPostInfiniteQuery, number | null>
        >([QueryKey.POSTS]);

        queryClient.setQueryData(
          [QueryKey.POSTS],
          // TODO
          (
            oldPosts:
              | InfiniteData<TPostInfiniteQuery, number | null>
              | undefined
          ) => {
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
                        if (post?.id === id) {
                          return { ...post, ...payload };
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

        return { previousPosts };
      } else {
        await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS, id] });

        const previousPost = queryClient.getQueryData<TPostQuery>([
          QueryKey.POSTS,
          id,
        ]);

        queryClient.setQueryData(
          [QueryKey.POSTS, id],
          // TODO
          (oldPost: TPostQuery | undefined) => {
            if (oldPost === undefined) {
              return oldPost;
            }

            return {
              ...oldPost,
              data: {
                ...oldPost.data,
                post: { ...oldPost.data?.post, ...payload },
              },
            };
          }
        );

        return { previousPost };
      }
    },
    onError: (
      _error,
      { id }: TVariables,
      context: TContext | undefined
    ): void => {
      if (
        context !== undefined &&
        'previousPosts' in context &&
        context.previousPosts !== undefined
      ) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);
      }

      if (
        context !== undefined &&
        'previousPost' in context &&
        context.previousPost !== undefined
      ) {
        queryClient.setQueryData([QueryKey.POSTS, id], context.previousPost);
      }
    },
    onSettled: (
      _data,
      _error,
      { id }: TVariables,
      context: TContext | undefined
    ): void => {
      if (
        context !== undefined &&
        'previousPosts' in context &&
        context.previousPosts !== undefined
      ) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      }

      if (
        context !== undefined &&
        'previousPost' in context &&
        context.previousPost !== undefined
      ) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS, id] });
      }
    },
  });
};

export default useUpdatePost;
