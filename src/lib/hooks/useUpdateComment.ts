'use client';

import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import type {
  CommentWithRelationsAndRelationCountsAndUserReaction,
  TCommentInfiniteQuery,
  TCommentMutation,
  TCommentsContext,
  TCommentVariables,
} from '../types';
import { getCommentQueryKey } from '../utils';

const useUpdateComment = (): UseMutationResult<
  TCommentMutation,
  Error,
  TCommentVariables,
  TCommentsContext
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: TCommentVariables): Promise<TCommentMutation> => {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result: TCommentMutation = await response.json();

      if (!response.ok && result.errors !== null) {
        throw new Error(Object.values(result.errors).flat().join('. ').trim());
      }

      return result;
    },
    onMutate: async ({
      id,
      payload,
    }: TCommentVariables): Promise<TCommentsContext | undefined> => {
      const queryKey = getCommentQueryKey(
        payload.postId,
        payload.parentCommentId
      );

      await queryClient.cancelQueries({ queryKey });

      const previousComments =
        queryClient.getQueryData<
          InfiniteData<TCommentInfiniteQuery, number | null>
        >(queryKey);

      queryClient.setQueryData(
        queryKey,
        // TODO
        (
          oldComments:
            | InfiniteData<TCommentInfiniteQuery, number | null>
            | undefined
        ) => {
          if (oldComments === undefined) {
            return oldComments;
          }

          return {
            ...oldComments,
            // TODO
            pages: oldComments.pages.map((page: TCommentInfiniteQuery) => {
              return {
                ...page,
                data: {
                  ...page.data,
                  // TODO
                  comments: page.data?.comments.map(
                    (
                      comment: CommentWithRelationsAndRelationCountsAndUserReaction
                    ) => {
                      return comment?.id === id
                        ? { ...comment, ...payload }
                        : comment;
                    }
                  ),
                },
              };
            }),
          };
        }
      );

      return { previousComments };
    },
    onError: (
      _error,
      { payload }: TCommentVariables,
      context: TCommentsContext | undefined
    ): void => {
      if (context?.previousComments !== undefined) {
        const queryKey = getCommentQueryKey(
          payload.postId,
          payload.parentCommentId
        );

        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: (_data, _error, { payload }: TCommentVariables): void => {
      const queryKey = getCommentQueryKey(
        payload.postId,
        payload.parentCommentId
      );

      queryClient.invalidateQueries({ queryKey, exact: true });
    },
  });
};

export default useUpdateComment;
