import { useInfiniteQuery } from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type CommentWithRelationsAndRelationCountsAndUserReaction } from '../types';

const useReadReplies = (
  comment: CommentWithRelationsAndRelationCountsAndUserReaction
) => {
  const getReplies = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(
      `/api/posts/${comment?.postId}/comments/${comment?.id}/replies?cursor=${pageParam}`
    );

    if (!response.ok) throw new Error('Network response was not ok');

    return response.json();
  };

  return useInfiniteQuery({
    queryFn: getReplies,
    queryKey: [QueryKey.REPLIES, comment?.postId, comment?.id],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });
};

export default useReadReplies;
