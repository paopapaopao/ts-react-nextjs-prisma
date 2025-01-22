'use client';

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type PostSchema } from '../types';

import useSignedInUser from './useSignedInUser';

const mockPostData = {
  id: 0,
  title: '',
  body: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 0,
  originalPostId: null,
  hasSharedPost: false,
  user: null,
  originalPost: null,
  _count: {
    shares: 0,
    comments: 0,
    reactions: 0,
    views: 0,
  },
  userReaction: null,
};

const mutationFn = async (payload: PostSchema) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
};

const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { signedInUser } = useSignedInUser();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });

      const previousPosts = queryClient.getQueryData([QueryKey.POSTS]);

      queryClient.setQueryData(
        [QueryKey.POSTS],
        (oldPosts: InfiniteData<unknown, unknown>) => {
          const id: number = Number(new Date());

          return {
            ...oldPosts,
            pages: [
              {
                data: {
                  nextCursor: id,
                  posts: [
                    { ...mockPostData, ...variables, id, user: signedInUser },
                  ],
                },
                errors: null,
                success: true,
              },
              ...oldPosts.pages,
            ],
          };
        }
      );

      return { previousPosts };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPosts !== undefined) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);
      }
    },
    onSettled: (): void => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });
};

export default useCreatePost;
