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
      await queryClient.cancelQueries({
        queryKey: [QueryKey.COMMENTS, payload.postId],
      });

      const previousComments = queryClient.getQueryData([
        QueryKey.COMMENTS,
        payload.postId,
      ]);

      queryClient.setQueryData(
        [QueryKey.COMMENTS, payload.postId],
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
        queryClient.setQueryData(
          [QueryKey.COMMENTS, payload.postId],
          context.previousComments
        );
      }
    },
    onSettled: (_data, _error, { payload }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.COMMENTS, payload.postId],
      });

      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });

      queryClient.invalidateQueries({
        queryKey: [QueryKey.POSTS, payload.postId],
      });
    },
  });
};

export default useUpdateComment;
