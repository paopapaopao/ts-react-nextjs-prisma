'use client';

import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import type {
  PostWithRelationsAndRelationCountsAndUserReaction,
  TPostContext,
  TPostInfiniteQuery,
  TPostMutation,
  TPostQuery,
  TPostsContext,
} from '../types';

const useDeletePost = (
  queryKey: (string | number)[],
  pathname: string
): UseMutationResult<
  TPostMutation,
  Error,
  number | undefined,
  TPostContext | TPostsContext
> => {
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
    onMutate: async (
      id: number | undefined
    ): Promise<TPostContext | TPostsContext | undefined> => {
      await queryClient.cancelQueries({ queryKey });

      if (pathname === '/' || pathname === '/search') {
        const previousPosts =
          queryClient.getQueryData<
            InfiniteData<TPostInfiniteQuery, number | null>
          >(queryKey);

        queryClient.setQueryData(
          queryKey,
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
        const previousPost = queryClient.getQueryData<TPostQuery>(queryKey);

        queryClient.removeQueries({ queryKey });

        return { previousPost };
      }
    },
    onError: (
      _error,
      _id,
      context: TPostContext | TPostsContext | undefined
    ): void => {
      if (
        context !== undefined &&
        'previousPosts' in context &&
        context.previousPosts !== undefined
      ) {
        queryClient.setQueryData(queryKey, context.previousPosts);
      }

      if (
        context !== undefined &&
        'previousPost' in context &&
        context.previousPost !== undefined
      ) {
        queryClient.setQueryData(queryKey, context.previousPost);
      }
    },
    onSettled: (): void => {
      queryClient.invalidateQueries({ queryKey, exact: true });
    },
  });
};

export default useDeletePost;
