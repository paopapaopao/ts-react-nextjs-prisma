'use client';

import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  PostWithRelationsAndRelationCountsAndUserReaction,
  TPostInfiniteQuery,
  TPostMutation,
  TPostQuery,
} from '../types';

type TContext =
  | { previousPost: TPostQuery | undefined }
  | {
      previousPosts:
        | InfiniteData<TPostInfiniteQuery, number | null>
        | undefined;
    };

const useDeletePost = (
  pathname: string
): UseMutationResult<TPostMutation, Error, number | undefined, TContext> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | undefined): Promise<TPostMutation> => {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      const result: TPostMutation = await response.json();

      if (!response.ok && result.errors !== null) {
        throw new Error(Object.values(result.errors).flat().join('. ').trim());
      }

      return result;
    },
    onMutate: async (id: number | undefined): Promise<TContext | undefined> => {
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
                    posts: page.data?.posts.filter(
                      (
                        post: PostWithRelationsAndRelationCountsAndUserReaction
                      ) => {
                        return post?.id !== id;
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

        queryClient.removeQueries({ queryKey: [QueryKey.POSTS, id] });

        return { previousPost };
      }
    },
    onError: (
      _error,
      id: number | undefined,
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
    onSettled: async (
      _data,
      _error,
      id: number | undefined,
      context: TContext | undefined
    ): Promise<void> => {
      if (
        context !== undefined &&
        'previousPosts' in context &&
        context.previousPosts !== undefined
      ) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      }

      if (
        context !== undefined &&
        'previousPost' in context &&
        context.previousPost !== undefined
      ) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS, id] });
      }
    },
  });
};

export default useDeletePost;
