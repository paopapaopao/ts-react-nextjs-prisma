import { CommentSchema, PostSchema, ReactionSchema } from './schemas';

type TVariables<TId, TPayload> = {
  id: TId;
  payload: TPayload;
};

export * from './action-returns';
export * from './api-responses';
export * from './schemas';

export type TPageParam = { pageParam: number | null };

export type TCommentVariables = TVariables<number | undefined, CommentSchema>;
export type TPostVariables = TVariables<number | undefined, PostSchema>;
export type TReactionVariables = TVariables<string, ReactionSchema>;
