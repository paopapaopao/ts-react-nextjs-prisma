'use client';

import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type { PostSchema, TPostInfiniteQuery, TPostMutation } from '../types';

import useSignedInUser from './useSignedInUser';

type TContext = {
  previousPosts: InfiniteData<TPostInfiniteQuery, number | null> | undefined;
};

const useCreatePost = (): UseMutationResult<
  TPostMutation,
  Error,
  PostSchema,
  TContext
> => {
  const queryClient = useQueryClient();
  const { signedInUser } = useSignedInUser();

  return useMutation({
    mutationFn: async (payload: PostSchema): Promise<TPostMutation> => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result: TPostMutation = await response.json();

      if (!response.ok && result.errors !== null) {
        throw new Error(Object.values(result.errors).flat().join('. ').trim());
      }

      return result;
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
                pages: [newPage],
                // pageParams: [id],
              }
            : {
                ...oldPosts,
                pages: [newPage, ...oldPosts.pages],
                // pageParams: [id, ...oldPosts.pageParams],
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
    onSettled: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });
};

export default useCreatePost;
