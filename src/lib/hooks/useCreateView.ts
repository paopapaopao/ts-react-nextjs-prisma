'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type ViewSchema } from '../types';

// TODO
const useCreateView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ViewSchema) => {
      const response = await fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
};

export default useCreateView;
