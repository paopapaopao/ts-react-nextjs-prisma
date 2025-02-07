'use client';

import {
  type InfiniteData,
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type {
  CommentWithRelationsAndRelationCountsAndUserReaction,
  TCommentMutation,
  TCommentInfiniteQuery,
} from '../types';

type TContext = {
  previousComments:
    | InfiniteData<TCommentInfiniteQuery, number | null>
    | undefined;
};

const useDeleteComment = (
  postId: number | undefined,
  parentCommentId: number | null | undefined
): UseMutationResult<TCommentMutation, Error, number | undefined, TContext> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | undefined): Promise<TCommentMutation> => {
      const response: Response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      return result.data;
    },
    onMutate: async (id: number | undefined): Promise<TContext | undefined> => {
      const queryKey: (QueryKey | number | undefined)[] =
        parentCommentId === null
          ? [QueryKey.COMMENTS, postId]
          : [QueryKey.REPLIES, postId, parentCommentId];

      await queryClient.cancelQueries({ queryKey });

      const previousComments =
        queryClient.getQueryData<
          InfiniteData<TCommentInfiniteQuery, number | null>
        >(queryKey);

      queryClient.setQueryData(
        queryKey,
        // TODO
        (oldComments: InfiniteData<TCommentInfiniteQuery> | undefined) => {
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
        const queryKey: (QueryKey | number | undefined)[] =
          parentCommentId === null
            ? [QueryKey.COMMENTS, postId]
            : [QueryKey.REPLIES, postId, parentCommentId];

        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: (): void => {
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

export default useDeleteComment;
