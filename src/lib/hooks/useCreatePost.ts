'use client';

import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type { PostSchema, TPostQuery, TPostInfiniteQuery } from '../types';

import useSignedInUser from './useSignedInUser';

type TContext = {
  previousPosts: InfiniteData<TPostInfiniteQuery, number | null> | undefined;
};

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

const useCreatePost = (): UseMutationResult<
  TPostQuery,
  Error,
  PostSchema,
  TContext
> => {
  const queryClient = useQueryClient();
  const { signedInUser } = useSignedInUser();

  return useMutation({
    mutationFn: async (payload: PostSchema): Promise<TPostQuery> => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // TODO
      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      return result.data;
    },
    onMutate: async (payload: PostSchema): Promise<TContext | undefined> => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.POSTS] });

      const previousPosts = queryClient.getQueryData<
        InfiniteData<TPostInfiniteQuery, number | null>
      >([QueryKey.POSTS]);

      queryClient.setQueryData(
        [QueryKey.POSTS],
        // TODO
        (
          oldPosts: InfiniteData<TPostInfiniteQuery, number | null> | undefined
        ) => {
          const id = Number(new Date());

          const newPage = {
            data: {
              posts: [{ ...mockPostData, ...payload, id, user: signedInUser }],
              nextCursor: id,
            },
            errors: null,
          };

          return oldPosts === undefined
            ? {
                // pageParams: [id],
                pages: [newPage],
              }
            : {
                ...oldPosts,
                // pageParams: [id, ...oldPosts.pageParams],
                pages: [newPage, ...oldPosts.pages],
              };
        }
      );

      return { previousPosts };
    },
    onError: (_error, _payload, context: TContext | undefined): void => {
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
