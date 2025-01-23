'use client';

import { ReactionType } from '@prisma/client';
import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import {
  type CommentWithRelationsAndRelationCountsAndUserReaction,
  type PostWithRelationsAndRelationCountsAndUserReaction,
  type ReactionSchema,
} from '../types';

type TPosts = {
  data: {
    nextCursor: number | null;
    posts: PostWithRelationsAndRelationCountsAndUserReaction[];
  };
  errors: { [key: string]: string[] } | null;
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

const mockReactionData = {
  id: 0,
  type: ReactionType.LIKE,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 0,
  clerkUserId: '',
  postId: 0,
  commentId: 0,
};

const mutationFn = async (payload: ReactionSchema) => {
  const response = await fetch('/api/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
};

const useCreateReaction = (
  postId: number | null | undefined = undefined,
  parentCommentId: number | null | undefined = undefined
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      let previousComments;
      let previousPosts;
      let previousPost;

      console.log('variables', variables);

      if (variables.postId === null) {
        console.log('comment');

        const queryKey =
          parentCommentId === undefined
            ? [QueryKey.REPLIES, variables.postId, parentCommentId]
            : [QueryKey.COMMENTS, postId];

        console.log('queryKey', queryKey);

        previousComments = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(
          queryKey,
          (oldComments: InfiniteData<TComments>) => {
            const id: number = Number(new Date());

            const reaction = {
              ...mockReactionData,
              ...variables,
              id,
            };

            return {
              ...oldComments,
              pages: oldComments.pages.map((page: TComments) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    comments: page.data.comments.map((comment) => {
                      if (
                        comment?.id === reaction?.commentId &&
                        comment?.userId === reaction?.userId
                      ) {
                        return {
                          ...comment,
                          userReaction: {
                            ...comment.userReaction,
                            ...reaction,
                          },
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
      } else {
        console.log('post');

        previousPosts = queryClient.getQueryData([QueryKey.POSTS]);
        previousPost = queryClient.getQueryData([
          QueryKey.POSTS,
          variables.postId,
        ]);

        queryClient.setQueryData(
          [QueryKey.POSTS],
          (oldComments: InfiniteData<TPosts>) => {
            const id: number = Number(new Date());

            const reaction = {
              ...mockReactionData,
              ...variables,
              id,
            };

            return {
              ...oldComments,
              pages: oldComments.pages.map((page: TPosts) => {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    posts: page.data.posts.map((post) => {
                      if (
                        post?.id === reaction?.postId &&
                        post?.userId === reaction?.userId
                      ) {
                        return {
                          ...post,
                          userReaction: {
                            ...post.userReaction,
                            ...reaction,
                          },
                        };
                      }

                      return post;
                    }),
                  },
                };
              }),
            };
          }
        );
      }

      return { previousComments, previousPosts, previousPost };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPosts !== undefined) {
        queryClient.setQueryData([QueryKey.POSTS], context.previousPosts);
      }

      if (context?.previousPost !== undefined) {
        queryClient.setQueryData(
          [QueryKey.POSTS, postId],
          context.previousPost
        );
      }

      if (context?.previousComments !== undefined) {
        queryClient.setQueryData(
          [QueryKey.COMMENTS, postId],
          context.previousComments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.COMMENTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.REPLIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POST] });
    },
  });
};

export default useCreateReaction;
