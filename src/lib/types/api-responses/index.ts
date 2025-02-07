import {
  type Comment,
  type Post,
  type Reaction,
  type User,
  type View,
} from '@prisma/client';

import {
  CommentWithRelationsAndRelationCountsAndUserReaction,
  PostWithRelationsAndRelationCountsAndUserReaction,
} from '../action-returns';

type ApiQueryResponse<T, K extends string> = {
  data: { [key in K]: T | null } | null;
  errors: { [key: string]: string[] } | null;
};

type ApiInfiniteQueryResponse<T, K extends string> = {
  data: ({ [key in K]: T[] } & { nextCursor: number | null }) | null;
  errors: { [key: string]: string[] } | null;
};

type ApiMutationResponse<T, K extends string> = {
  data: { [key in K]: T | null } | null;
  errors: { [key: string]: string[] } | null;
};

export type TPostQuery = ApiQueryResponse<
  PostWithRelationsAndRelationCountsAndUserReaction,
  'post'
>;

export type TUserQuery = ApiQueryResponse<User, 'user'>;

export type TCommentInfiniteQuery = ApiInfiniteQueryResponse<
  CommentWithRelationsAndRelationCountsAndUserReaction,
  'comments'
>;

export type TPostInfiniteQuery = ApiInfiniteQueryResponse<
  PostWithRelationsAndRelationCountsAndUserReaction,
  'posts'
>;

export type TCommentMutation = ApiMutationResponse<Comment, 'comment'>;
export type TPostMutation = ApiMutationResponse<Post, 'post'>;
export type TReactionMutation = ApiMutationResponse<Reaction, 'reaction'>;
export type TViewMutation = ApiMutationResponse<View, 'view'>;
