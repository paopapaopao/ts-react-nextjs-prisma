'use client';

import { type Post } from '@prisma/client';
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

type TPost = {
  data: { post: Post | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

type TPosts = {
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
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });
      await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS, id] });

      const previousPosts = queryClient.getQueryData([QueryKey.POSTS]);
      const previousPost = queryClient.getQueryData([QueryKey.POSTS, id]);

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
                  posts: page.data.posts.map((post) => {
                    if (post?.id === id) {
                      return {
                        ...post,
                        ...payload,
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

      queryClient.setQueryData([QueryKey.POSTS, id], (oldPost: TPost) => {
        if (!oldPost) {
          return oldPost;
        }

        return {
          ...oldPost,
          data: {
            ...oldPost.data,
            post: oldPost.data
              ? { ...oldPost.data.post, ...payload }
              : { ...payload },
          },
        };
      });

      return { previousPosts, previousPost };
    },
    onError: (_error, { id }, context) => {
      if (context?.previousPosts !== undefined) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);
      }

      if (context?.previousPost !== undefined) {
        queryClient.setQueryData([QueryKey.POSTS, id], context.previousPost);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS, id] });
    },
  });
};

export default useUpdatePost;
