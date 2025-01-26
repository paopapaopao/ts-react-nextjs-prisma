'use client';

import { type Comment } from '@prisma/client';
import {
  type InfiniteData,
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import {
  type CommentSchema,
  type CommentWithRelationsAndRelationCountsAndUserReaction,
} from '../types';

type TComment = {
  data: { comment: Comment | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

type TComments = {
  data: {
    comments: CommentWithRelationsAndRelationCountsAndUserReaction[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

type TVariables = {
  id: number | undefined;
  payload: CommentSchema;
};

type TContext = {
  previousComments: InfiniteData<TComments, number | null> | undefined;
};

const useUpdateComment = (): UseMutationResult<
  TComment,
  Error,
  TVariables,
  TContext
> => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: TVariables): Promise<TComment> => {
      const response: Response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      return await response.json();
    },
    onMutate: async ({
      id,
      payload,
    }: TVariables): Promise<TContext | undefined> => {
      const queryKey: (QueryKey | number)[] =
        payload.parentCommentId === null
          ? [QueryKey.COMMENTS, payload.postId]
          : [QueryKey.REPLIES, payload.postId, payload.parentCommentId];

      await queryClient.cancelQueries({ queryKey });

      const previousComments =
        queryClient.getQueryData<InfiniteData<TComments, number | null>>(
          queryKey
        );

      queryClient.setQueryData(
        queryKey,
        // TODO
        (oldComments: InfiniteData<TComments> | undefined) => {
          if (oldComments === undefined) {
            return oldComments;
          }

          return {
            ...oldComments,
            // TODO
            pages: oldComments.pages.map((page: TComments) => {
              return {
                ...page,
                data: {
                  ...page.data,
                  // TODO
                  comments: page.data.comments.map(
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
        const queryKey: (QueryKey | number)[] =
          payload.parentCommentId === null
            ? [QueryKey.COMMENTS, payload.postId]
            : [QueryKey.REPLIES, payload.postId, payload.parentCommentId];

        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: (_data, _error, { payload }: TVariables): void => {
      const queryKey =
        payload.parentCommentId === null
          ? [QueryKey.COMMENTS, payload.postId]
          : [QueryKey.REPLIES, payload.postId, payload.parentCommentId];

      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default useUpdateComment;
