import { type Post, type User } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type PostWithRelationsAndRelationCountsAndUserReaction } from '../types';

const useReadComments = (
  post:
    | PostWithRelationsAndRelationCountsAndUserReaction
    | (Post & { user: User })
) => {
  const getComments = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(
      `/api/posts/${post?.id}/comments?cursor=${pageParam}`
    );

    if (!response.ok) throw new Error('Network response was not ok');

    return response.json();
  };

  return useInfiniteQuery({
    queryFn: getComments,
    queryKey: [QueryKey.COMMENTS, post?.id],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });
};

export default useReadComments;
