import {
  type Comment,
  type Post,
  type Reaction,
  type View,
} from '@prisma/client';

import {
  CommentWithRelationsAndRelationCountsAndUserReaction,
  PostWithRelationsAndRelationCountsAndUserReaction,
} from '../action-returns';

type ApiInfiniteQueryResponse<T, K extends string> = {
  data:
    | ({ [key in K]: T[] } & {
        nextCursor: number | null;
      })
    | null;
  errors: { [key: string]: string[] } | null;
};

type ApiMutationResponse<T, K extends string> = {
  data: { [key in K]: T | null } | null;
  errors: { [key: string]: string[] } | null;
};

export type TComments = ApiInfiniteQueryResponse<
  CommentWithRelationsAndRelationCountsAndUserReaction,
  'comments'
>;

export type TPosts = ApiInfiniteQueryResponse<
  PostWithRelationsAndRelationCountsAndUserReaction,
  'posts'
>;

export type TComment = ApiMutationResponse<Comment, 'comment'>;
export type TPost = ApiMutationResponse<Post, 'post'>;
export type TReaction = ApiMutationResponse<Reaction, 'reaction'>;
export type TView = ApiMutationResponse<View, 'view'>;
