'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type ReactionSchema } from '../types';

// TODO
const useCreateReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReactionSchema) => {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
};

export default useCreateReaction;
