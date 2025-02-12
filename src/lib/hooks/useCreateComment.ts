'use client';

import { type Params } from 'next/dist/server/request/params';
import { type ReadonlyURLSearchParams } from 'next/navigation';
import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  CommentSchema,
  TCommentInfiniteQuery,
  TCommentMutation,
} from '../types';
import { getCommentQueryKey, getPostQueryKey } from '../utils';

import useSignedInUser from './useSignedInUser';

type TContext = {
  previousComments:
    | InfiniteData<TCommentInfiniteQuery, number | null>
    | undefined;
};

const useCreateComment = (
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  params: Params
): UseMutationResult<TCommentMutation, Error, CommentSchema, TContext> => {
  const queryClient = useQueryClient();
  const { signedInUser } = useSignedInUser();

  return useMutation({
    mutationFn: async (payload: CommentSchema): Promise<TCommentMutation> => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result: TCommentMutation = await response.json();

      if (!response.ok && result.errors !== null) {
        throw new Error(Object.values(result.errors).flat().join('. ').trim());
      }

      return result;
    },
    onMutate: async (payload: CommentSchema): Promise<TContext | undefined> => {
      const commentQueryKey = getCommentQueryKey(
        payload.postId,
        payload.parentCommentId
      );

      await queryClient.cancelQueries({ queryKey: commentQueryKey });

      const previousComments =
        queryClient.getQueryData<
          InfiniteData<TCommentInfiniteQuery, number | null>
        >(commentQueryKey);

      queryClient.setQueryData(
        commentQueryKey,
        // TODO
        (
          oldComments:
            | InfiniteData<TCommentInfiniteQuery, number | null>
            | undefined
        ) => {
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

          const id = Number(new Date());

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
                pages: [newPage],
                // pageParams: [id],
              }
            : {
                ...oldComments,
                pages: [...oldComments.pages, newPage],
                // pageParams: [...oldComments.pageParams, id],
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
        const commentQueryKey = getCommentQueryKey(postId, parentCommentId);

        queryClient.setQueryData(commentQueryKey, context.previousComments);
      }
    },
    onSettled: (
      _data,
      _error,
      { postId, parentCommentId }: CommentSchema
    ): void => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.COMMENTS, postId],
        exact: true,
      });

      if (parentCommentId === null) {
        const postQueryKey = getPostQueryKey(pathname, searchParams, params);

        queryClient.invalidateQueries({ queryKey: postQueryKey, exact: true });
      } else {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.REPLIES, postId, parentCommentId],
          exact: true,
        });
      }
    },
  });
};

export default useCreateComment;
