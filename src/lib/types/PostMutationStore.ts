import type PostSchema from './PostSchema';

type PostMutationStore = {
  data: PostSchema | null;
  id: number | undefined;
  setData: (data: PostSchema) => void;
  setId: (id: number | undefined) => void;
};

export default PostMutationStore;
