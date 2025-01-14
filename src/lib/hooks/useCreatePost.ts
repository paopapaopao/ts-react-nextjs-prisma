'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type PostSchema } from '../types';

const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PostSchema) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });
};

export default useCreatePost;
