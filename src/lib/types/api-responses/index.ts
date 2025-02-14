import {
  type Comment,
  type Post,
  type Reaction,
  type User,
  type View,
} from '@prisma/client';

import type {
  CommentWithRelationsAndRelationCountsAndUserReaction,
  PostWithRelationsAndRelationCountsAndUserReaction,
} from '../action-returns';

type ApiQueryResponse<KData extends string, TData> = {
  data: { [key in KData]: TData | null } | null;
  errors: { [key: string]: string[] } | null;
};

type ApiInfiniteQueryResponse<KData extends string, TData> = {
  data: ({ [key in KData]: TData[] } & { nextCursor: number | null }) | null;
  errors: { [key: string]: string[] } | null;
};

type ApiMutationResponse<KData extends string, TData> = {
  data: { [key in KData]: TData | null } | null;
  errors: { [key: string]: string[] } | null;
};

export type PostQuery = ApiQueryResponse<
  'post',
  PostWithRelationsAndRelationCountsAndUserReaction
>;

export type UserQuery = ApiQueryResponse<'user', User>;

export type CommentInfiniteQuery = ApiInfiniteQueryResponse<
  'comments',
  CommentWithRelationsAndRelationCountsAndUserReaction
>;

export type PostInfiniteQuery = ApiInfiniteQueryResponse<
  'posts',
  PostWithRelationsAndRelationCountsAndUserReaction
>;

export type CommentMutation = ApiMutationResponse<'comment', Comment>;
export type PostMutation = ApiMutationResponse<'post', Post>;
export type ReactionMutation = ApiMutationResponse<'reaction', Reaction>;
export type ViewMutation = ApiMutationResponse<'view', View>;
