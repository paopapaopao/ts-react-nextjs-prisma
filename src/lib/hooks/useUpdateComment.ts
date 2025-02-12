'use client';

import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import type {
  CommentSchema,
  CommentWithRelationsAndRelationCountsAndUserReaction,
  TCommentInfiniteQuery,
  TCommentMutation,
} from '../types';
import { getCommentQueryKey } from '../utils';

type TVariables = {
  id: number | undefined;
  payload: CommentSchema;
};

type TContext = {
  previousComments:
    | InfiniteData<TCommentInfiniteQuery, number | null>
    | undefined;
};

const useUpdateComment = (): UseMutationResult<
  TCommentMutation,
  Error,
  TVariables,
  TContext
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: TVariables): Promise<TCommentMutation> => {
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
    }: TVariables): Promise<TContext | undefined> => {
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
                      if (comment?.id === id) {
                        return { ...comment, ...payload };
                      }

                      return comment;
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
      { payload }: TVariables,
      context: TContext | undefined
    ): void => {
      if (context?.previousComments !== undefined) {
        const queryKey = getCommentQueryKey(
          payload.postId,
          payload.parentCommentId
        );

        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: (_data, _error, { payload }: TVariables): void => {
      const queryKey = getCommentQueryKey(
        payload.postId,
        payload.parentCommentId
      );

      queryClient.invalidateQueries({ queryKey, exact: true });
    },
  });
};

export default useUpdateComment;
