'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type PostSchema } from '../types';

const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number | undefined;
      payload: PostSchema;
    }) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POST] });
    },
  });
};

export default useUpdatePost;
