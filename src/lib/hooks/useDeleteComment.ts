'use client';

import {
  type InfiniteData,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  CommentWithRelationsAndRelationCountsAndUserReaction,
  TCommentInfiniteQuery,
  TCommentMutation,
} from '../types';
import { getCommentQueryKey } from '../utils';

type TContext = {
  previousComments:
    | InfiniteData<TCommentInfiniteQuery, number | null>
    | undefined;
};

const useDeleteComment = (
  postId: number | undefined,
  parentCommentId: number | null | undefined,
  postQueryKey: (string | number)[]
): UseMutationResult<TCommentMutation, Error, number | undefined, TContext> => {
  const queryClient = useQueryClient();
  const commentQueryKey = getCommentQueryKey(postId, parentCommentId);

  return useMutation({
    mutationFn: async (id: number | undefined): Promise<TCommentMutation> => {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });

      const result: TCommentMutation = await response.json();

      if (!response.ok && result.errors !== null) {
        throw new Error(Object.values(result.errors).flat().join('. ').trim());
      }

      return result;
    },
    onMutate: async (id: number | undefined): Promise<TContext | undefined> => {
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
                  comments: page.data?.comments.filter(
                    (
                      comment: CommentWithRelationsAndRelationCountsAndUserReaction
                    ) => {
                      return comment?.id !== id;
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
    onError: (_error, _id, context: TContext | undefined): void => {
      if (context?.previousComments !== undefined) {
        queryClient.setQueryData(commentQueryKey, context.previousComments);
      }
    },
    onSettled: (): void => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.COMMENTS, postId],
        exact: true,
      });

      if (parentCommentId === null) {
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

export default useDeleteComment;
