'use client';

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import {
  type CommentSchema,
  type CommentWithRelationsAndRelationCountsAndUserReaction,
} from '../types';

type TComments = {
  data: {
    comments: CommentWithRelationsAndRelationCountsAndUserReaction[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const mutationFn = async ({
  id,
  payload,
}: {
  id: number | undefined;
  payload: CommentSchema;
}) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
};

const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async ({ id, payload }) => {
      const queryKey =
        payload.parentCommentId === null
          ? [QueryKey.COMMENTS, payload.postId]
          : [QueryKey.REPLIES, payload.postId, payload.parentCommentId];

      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (oldComments: InfiniteData<TComments>) => {
          if (!oldComments) {
            return oldComments;
          }

          return {
            ...oldComments,
            pages: oldComments.pages.map((page: TComments) => {
              return {
                ...page,
                data: {
                  ...page.data,
                  comments: page.data.comments.map((comment) => {
                    if (comment?.id === id) {
                      return {
                        ...comment,
                        ...payload,
                      };
                    }

                    return comment;
                  }),
                },
              };
            }),
          };
        }
      );

      return { previousComments };
    },
    onError: (_error, { payload }, context) => {
      if (context?.previousComments !== undefined) {
        const queryKey =
          payload.parentCommentId === null
            ? [QueryKey.COMMENTS, payload.postId]
            : [QueryKey.REPLIES, payload.postId, payload.parentCommentId];

        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: (_data, _error, { payload }) => {
      const queryKey =
        payload.parentCommentId === null
          ? [QueryKey.COMMENTS, payload.postId]
          : [QueryKey.REPLIES, payload.postId, payload.parentCommentId];

      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default useUpdateComment;
