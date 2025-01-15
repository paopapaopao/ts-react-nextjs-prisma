import type CommentSchema from './CommentSchema';

type CommentMutationStore = {
  data: CommentSchema | null;
  id: number | undefined;
  setData: (data: CommentSchema) => void;
  setId: (id: number | undefined) => void;
};

export default CommentMutationStore;
