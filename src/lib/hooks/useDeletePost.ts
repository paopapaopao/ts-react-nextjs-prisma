'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '../enums';

const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | undefined) => {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POST] });
    },
  });
};

export default useDeletePost;
