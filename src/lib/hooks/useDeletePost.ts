'use client';

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type PostWithRelationsAndRelationCountsAndUserReaction } from '../types';

type TPosts = {
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
    onMutate: async (postId: number | undefined) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });
      await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS, postId] });

      const previousPosts = queryClient.getQueryData([QueryKey.POSTS]);
      const previousPost = queryClient.getQueryData([QueryKey.POSTS, postId]);

      queryClient.setQueryData(
        [QueryKey.POSTS],
        (oldPosts: InfiniteData<TPosts>) => {
          if (!oldPosts) {
            return oldPosts;
          }

          return {
            ...oldPosts,
            pages: oldPosts.pages.map((page: TPosts) => {
              return {
                ...page,
                data: {
                  ...page.data,
                  posts: page.data.posts.filter((post) => {
                    return post?.id !== postId;
                  }),
                },
              };
            }),
          };
        }
      );

      queryClient.removeQueries({ queryKey: [QueryKey.POSTS, postId] });

      return { previousPosts, previousPost };
    },
    onError: (_error, postId, context) => {
      if (context?.previousPosts !== undefined) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);
      }

      if (context?.previousPost !== undefined) {
        queryClient.setQueryData(
          [QueryKey.POSTS, postId],
          context.previousPost
        );
      }
    },
    onSettled: (_data, _error, postId): void => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS, postId] });
    },
  });
};

export default useDeletePost;
