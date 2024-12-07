import { useMutation, useQueryClient } from '@tanstack/react-query';

// TODO
const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | undefined) => {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export default useDeletePost;
