'use client';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type PostWithRelationsAndRelationCountsAndUserReaction } from '../types';

type TPost = {
  data: {
    post: PostWithRelationsAndRelationCountsAndUserReaction | null;
  } | null;
  errors: { [key: string]: string[] } | unknown | null;
};

const useReadPost = (id: string): UseQueryResult<TPost> => {
  return useQuery({
    queryKey: [QueryKey.POSTS, Number(id)],
    queryFn: async (): Promise<TPost> => {
      const response: Response = await fetch(`/api/posts/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      // TODO
      return result;
    },
  });
};

export default useReadPost;
