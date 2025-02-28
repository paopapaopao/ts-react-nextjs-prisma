import { QueryKey } from '../enums';

const getCommentQueryKey = (
  postId: number | undefined,
  parentCommentId: number | null | undefined
): (QueryKey | number | undefined)[] => {
  return parentCommentId === null
    ? [QueryKey.COMMENTS, postId]
    : [QueryKey.REPLIES, postId, parentCommentId];
};

export default getCommentQueryKey;
