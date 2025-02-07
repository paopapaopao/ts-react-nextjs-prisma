'use client';

import { type User } from '@prisma/client';
import {
  type InfiniteData,
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  CommentSchema,
  TCommentMutation,
  TCommentInfiniteQuery,
} from '../types';

import useSignedInUser from './useSignedInUser';

type TContext = {
  previousComments:
    | InfiniteData<TCommentInfiniteQuery, number | null>
    | undefined;
};

// TODO
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

const useCreateComment = (): UseMutationResult<
  TCommentMutation,
  Error,
  CommentSchema,
  TContext
> => {
  const queryClient: QueryClient = useQueryClient();
  const { signedInUser }: { signedInUser: User | null } = useSignedInUser();

  return useMutation({
    mutationFn: async (payload: CommentSchema): Promise<TCommentMutation> => {
      const response: Response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      return result.data;
    },
    onMutate: async (payload: CommentSchema): Promise<TContext | undefined> => {
      const queryKey: (QueryKey | number)[] =
        payload.parentCommentId === null
          ? [QueryKey.COMMENTS, payload.postId]
          : [QueryKey.REPLIES, payload.postId, payload.parentCommentId];

      await queryClient.cancelQueries({ queryKey });

      const previousComments =
        queryClient.getQueryData<
          InfiniteData<TCommentInfiniteQuery, number | null>
        >(queryKey);

      queryClient.setQueryData(
        queryKey,
        // TODO
        (oldComments: InfiniteData<TCommentInfiniteQuery> | undefined) => {
          const id: number = Number(new Date());

          // TODO
          const newPage = {
            data: {
              comments: [
                { ...mockCommentData, ...payload, id, user: signedInUser },
              ],
              nextCursor: id,
            },
            errors: null,
          };

          return oldComments === undefined
            ? {
                // pageParams: [id],
                pages: [newPage],
              }
            : {
                ...oldComments,
                // pageParams: [...oldComments.pageParams, id],
                pages: [...oldComments.pages, newPage],
              };
        }
      );

      return { previousComments };
    },
    onError: (
      _error,
      { postId, parentCommentId }: CommentSchema,
      context: TContext | undefined
    ): void => {
      if (context?.previousComments !== undefined) {
        const queryKey: (QueryKey | number)[] =
          parentCommentId === null
            ? [QueryKey.COMMENTS, postId]
            : [QueryKey.REPLIES, postId, parentCommentId];

        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: (
      _data,
      _error,
      { postId, parentCommentId }: CommentSchema
    ): void => {
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
