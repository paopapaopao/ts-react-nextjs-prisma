'use client';

import { type User } from '@prisma/client';
import { type QueryClient } from '@tanstack/query-core';
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

type Props = {
  queryClient: QueryClient;
  queryKey: unknown[];
  signedInUser: User | null;
  variables: CommentSchema;
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

const mutateQueryData = async ({
  queryClient,
  queryKey,
  variables,
  signedInUser,
}: Props) => {
  await queryClient.cancelQueries({ queryKey });

  const previousComments = queryClient.getQueryData(queryKey);

  queryClient.setQueryData(
    queryKey,
    (oldComments: InfiniteData<unknown, unknown>) => {
      const id: number = Number(new Date());

      const newComment = {
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
      };

      return oldComments
        ? {
            ...oldComments,
            pages: [...oldComments.pages, newComment],
          }
        : {
            pageParams: [id],
            pages: [newComment],
          };
    }
  );

  return previousComments;
};

const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { signedInUser } = useSignedInUser();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      let previousComments;
      let previousReplies;

      if (variables.parentCommentId === null) {
        previousComments = await mutateQueryData({
          queryClient,
          signedInUser,
          variables,
          queryKey: [QueryKey.COMMENTS, variables.postId],
        });
      } else {
        previousReplies = await mutateQueryData({
          queryClient,
          signedInUser,
          variables,
          queryKey: [
            QueryKey.REPLIES,
            variables.postId,
            variables.parentCommentId,
          ],
        });
      }

      return { previousComments, previousReplies };
    },
    onError: (_error, { postId, parentCommentId }, context) => {
      if (context?.previousComments === undefined) {
        queryClient.setQueryData(
          [QueryKey.REPLIES, postId, parentCommentId],
          context?.previousReplies
        );
      } else {
        queryClient.setQueryData(
          [QueryKey.COMMENTS, postId],
          context?.previousComments
        );
      }
    },
    onSettled: (_data, _error, { postId, parentCommentId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.COMMENTS, postId] });

      if (parentCommentId === null) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
        queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS, postId] });
      } else {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.REPLIES, postId, parentCommentId],
        });
      }
    },
  });
};

export default useCreateComment;
