'use client';

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type CommentWithRelationsAndRelationCountsAndUserReaction } from '../types';

type TComments = {
  data: {
    comments: CommentWithRelationsAndRelationCountsAndUserReaction[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const mutationFn = async (id: number | undefined) => {
  const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
  const data = await response.json();

  return data;
};

const useDeleteComment = (postId: number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKey.COMMENTS, postId],
      });

      const previousComments = queryClient.getQueryData([
        QueryKey.COMMENTS,
        postId,
      ]);

      queryClient.setQueryData(
        [QueryKey.COMMENTS, postId],
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
                  comments: page.data.comments.filter((comment) => {
                    return comment?.id !== commentId;
                  }),
                },
              };
            }),
          };
        }
      );

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments !== undefined) {
        queryClient.setQueryData(
          [QueryKey.COMMENTS, postId],
          context.previousComments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.COMMENTS, postId] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS, postId] });
    },
  });
};

export default useDeleteComment;
