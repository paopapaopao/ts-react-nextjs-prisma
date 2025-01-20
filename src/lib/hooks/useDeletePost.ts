'use client';

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type PostWithRelationsAndRelationCountsAndUserReaction } from '../types';

type GETReturn = {
  data: {
    nextCursor: number | null;
    posts: PostWithRelationsAndRelationCountsAndUserReaction[];
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const mutationFn = async (id: number | undefined) => {
  const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  const data = await response.json();

  return data;
};

const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });

      const previousPosts = queryClient.getQueryData([QueryKey.POSTS]);

      queryClient.setQueryData(
        [QueryKey.POSTS],
        (oldPosts: InfiniteData<GETReturn>) => {
          return {
            ...oldPosts,
            pages: oldPosts.pages.map((page: GETReturn) => {
              return {
                ...page,
                data: {
                  ...page.data,
                  posts: page.data.posts.filter((post) => {
                    return post?.id !== variables;
                  }),
                },
              };
            }),
          };
        }
      );

      return { previousPosts };
    },
    onError: (_error, _variables, context) => {
      if (
        context?.previousPosts !== null ||
        context?.previousPosts !== undefined
      ) {
        queryClient.setQueryData([QueryKey.POSTS], context?.previousPosts);
      }
    },
    onSettled: (): void => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POST] });
    },
  });
};

export default useDeletePost;
