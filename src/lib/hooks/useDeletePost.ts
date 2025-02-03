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
  PostWithRelationsAndRelationCountsAndUserReaction,
  TPost,
  TPosts,
} from '../types';

type TContext = {
  previousPost: TPost | undefined;
  previousPosts: InfiniteData<TPosts, number | null> | undefined;
};

const useDeletePost = (): UseMutationResult<
  TPost,
  Error,
  number | undefined,
  TContext
> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | undefined): Promise<TPost> => {
      const response: Response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      return result.data;
    },
    onMutate: async (id: number | undefined): Promise<TContext | undefined> => {
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
                  posts: page.data.posts.filter(
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

      queryClient.removeQueries({ queryKey: [QueryKey.POSTS, id] });

      return { previousPosts, previousPost };
    },
    onError: (
      _error,
      id: number | undefined,
      context: TContext | undefined
    ): void => {
      if (context?.previousPosts !== undefined) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);
      }

      if (context?.previousPost !== undefined) {
        queryClient.setQueryData([QueryKey.POSTS, id], context.previousPost);
      }
    },
    onSettled: (_data, _error, id: number | undefined): void => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS, id] });
    },
  });
};

export default useDeletePost;
