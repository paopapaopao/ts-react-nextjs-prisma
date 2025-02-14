import { type InfiniteData } from '@tanstack/react-query';

import type {
  CommentInfiniteQuery,
  PostInfiniteQuery,
  PostQuery,
} from '../api-responses';
import type { CommentSchema, PostSchema, ReactionSchema } from '../schemas';

type Variables<TId, TPayload> = {
  id: TId;
  payload: TPayload;
};

type Context<KData extends string, TData> = {
  [key in KData]: TData | undefined;
};

export type PageParam = { pageParam: number | null };

export type CommentVariables = Variables<number | undefined, CommentSchema>;
export type PostVariables = Variables<number | undefined, PostSchema>;
export type ReactionVariables = Variables<string, ReactionSchema>;

export type CommentsContext = Context<
  'previousComments',
  InfiniteData<CommentInfiniteQuery, number | null>
>;

export type PostContext = Context<'previousPost', PostQuery>;

export type PostsContext = Context<
  'previousPosts',
  InfiniteData<PostInfiniteQuery, number | null>
>;
