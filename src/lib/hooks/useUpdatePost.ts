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
  PostSchema,
  PostWithRelationsAndRelationCountsAndUserReaction,
  TPost,
  TPosts,
} from '../types';

type TVariables = {
  id: number | undefined;
  payload: PostSchema;
};

type TContext = {
  previousPost: TPost | undefined;
  previousPosts: InfiniteData<TPosts, number | null> | undefined;
};

const useUpdatePost = (): UseMutationResult<
  TPost,
  Error,
  TVariables,
  TContext
> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: TVariables): Promise<TPost> => {
      const response: Response = await fetch(`/api/posts/${id}`, {
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
    }: TVariables): Promise<TContext | undefined> => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });
      await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS, id] });

      const previousPosts = queryClient.getQueryData<
        InfiniteData<TPosts, number | null>
      >([QueryKey.POSTS]);

      const previousPost = queryClient.getQueryData<TPost>([
        QueryKey.POSTS,
        id,
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

      queryClient.setQueryData(
        [QueryKey.POSTS, id],
        // TODO
        (oldPost: TPost | undefined) => {
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

      return { previousPosts, previousPost };
    },
    onError: (
      _error,
      { id }: TVariables,
      context: TContext | undefined
    ): void => {
      if (context?.previousPosts !== undefined) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);
      }

      if (context?.previousPost !== undefined) {
        queryClient.setQueryData([QueryKey.POSTS, id], context.previousPost);
      }
    },
    onSettled: (_data, _error, { id }: TVariables): void => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS, id] });
    },
  });
};

export default useUpdatePost;
