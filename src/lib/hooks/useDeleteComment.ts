import { useMutation, useQueryClient } from '@tanstack/react-query';

// TODO
const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | undefined) => {
      const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
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

export default useDeleteComment;
