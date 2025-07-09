import { QueryKey } from '../enums';

export const getCommentQueryKey = (
  postId: number | undefined,
  parentCommentId: number | null | undefined
): (QueryKey | number | undefined)[] => {
  return parentCommentId === null
    ? [QueryKey.COMMENTS, postId]
    : [QueryKey.REPLIES, postId, parentCommentId];
};
