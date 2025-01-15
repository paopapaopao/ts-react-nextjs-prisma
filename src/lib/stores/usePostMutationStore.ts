import { type StoreApi, type UseBoundStore, create } from 'zustand';

import { type PostMutationStore, type PostSchema } from '../types';

const usePostMutationStore: UseBoundStore<StoreApi<PostMutationStore>> =
  create<PostMutationStore>((set) => {
    return {
      data: null,
      id: 0,
      setData: (data: PostSchema) => {
        set({ data });
      },
      setId: (id: number | undefined) => {
        set({ id });
      },
    };
  });

export default usePostMutationStore;
