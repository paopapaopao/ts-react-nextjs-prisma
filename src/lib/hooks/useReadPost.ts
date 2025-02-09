'use client';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { QueryKey } from '../enums';
import type { TPostQuery } from '../types';

const useReadPost = (id: number): UseQueryResult<TPostQuery, Error> => {
  return useQuery({
    queryKey: [QueryKey.POSTS, id],
    queryFn: async (): Promise<TPostQuery> => {
      const response = await fetch(`/api/posts/${id}`);
      const result: TPostQuery = await response.json();

      if (!response.ok && result.errors !== null) {
        throw new Error(Object.values(result.errors).flat().join('. ').trim());
      }

      return result;
    },
  });
};

export default useReadPost;
