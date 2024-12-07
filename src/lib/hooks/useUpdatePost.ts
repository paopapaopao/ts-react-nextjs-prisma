import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type PostSchema } from '../types';

const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      id,
    }: {
      payload: PostSchema;
      id: number | undefined;
    }) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data.data.post;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export default useUpdatePost;
