import { InfiniteData } from '@tanstack/react-query';

import {
  TCommentInfiniteQuery,
  TPostInfiniteQuery,
  TPostQuery,
} from '../api-responses';

type TContext<T, K extends string> = {
  [key in K]: T | undefined;
};

export type TCommentsContext = TContext<
  InfiniteData<TCommentInfiniteQuery, number | null>,
  'previousComments'
>;

export type TPostContext = TContext<TPostQuery, 'previousPost'>;

export type TPostsContext = TContext<
  InfiniteData<TPostInfiniteQuery, number | null>,
  'previousPosts'
>;
