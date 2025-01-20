'use client';

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import {
  type PostSchema,
  type PostWithRelationsAndRelationCountsAndUserReaction,
} from '../types';

type GETReturn = {
  data: {
    nextCursor: number | null;
    posts: PostWithRelationsAndRelationCountsAndUserReaction[];
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const mutationFn = async ({
  id,
  payload,
}: {
  id: number | undefined;
  payload: PostSchema;
}) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
};

const useUpdatePost = () => {
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
                  posts: page.data.posts.map((post) => {
                    if (post?.id === variables.id) {
                      return {
                        ...post,
                        ...variables.payload,
                      };
                    }

                    return post;
                  }),
                },
              };
            }),
          };
        }
      );

      return { previousPosts };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POST] });
    },
  });
};

export default useUpdatePost;
