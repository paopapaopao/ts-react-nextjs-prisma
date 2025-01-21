'use client';

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type CommentSchema } from '../types';

import useSignedInUser from './useSignedInUser';

const mockCommentData = {
  id: 0,
  body: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 0,
  postId: 0,
  parentCommentId: null,
  user: null,
  _count: {
    replies: 0,
    reactions: 0,
  },
  userReaction: null,
};

const mutationFn = async (payload: CommentSchema) => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
};

const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { signedInUser } = useSignedInUser();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKey.COMMENTS, variables.postId],
      });

      const previousComments = queryClient.getQueryData([
        QueryKey.COMMENTS,
        variables.postId,
      ]);

      queryClient.setQueryData(
        [QueryKey.COMMENTS, variables.postId],
        (oldComments: InfiniteData<unknown, unknown>) => {
          const id: number = Number(new Date());

          return {
            ...oldComments,
            pages: [
              ...oldComments.pages,
              {
                data: {
                  nextCursor: id,
                  comments: [
                    {
                      ...mockCommentData,
                      ...variables,
                      id,
                      user: signedInUser,
                    },
                  ],
                },
                errors: null,
                success: true,
              },
            ],
          };
        }
      );

      return { previousComments };
    },
    onError: (_error, { postId }, context) => {
      if (context?.previousComments !== undefined) {
        queryClient.setQueryData(
          [QueryKey.COMMENTS, postId],
          context?.previousComments
        );
      }
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.COMMENTS, postId] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS, postId] });
    },
  });
};

export default useCreateComment;
