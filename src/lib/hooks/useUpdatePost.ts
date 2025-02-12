'use client';

import { usePathname } from 'next/navigation';
import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

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
  queryKey: (string | number)[]
): UseMutationResult<TPostMutation, Error, TVariables, TContext> => {
  const queryClient = useQueryClient();
  const pathname = usePathname();

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
        const previousPost = queryClient.getQueryData<TPostQuery>(queryKey);

        queryClient.setQueryData(
          queryKey,
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
    onError: (_error, _variables, context: TContext | undefined): void => {
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

export default useUpdatePost;
