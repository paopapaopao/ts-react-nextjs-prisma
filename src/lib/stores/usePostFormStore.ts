import { create } from 'zustand';

import { type PostSchema } from '../types';

type PostFormStore = {
  data: PostSchema | null;
  setData: (data: PostSchema) => void;
};

const usePostFormStore = create<PostFormStore>((set) => {
  return {
    data: null,
    setData: (data: PostSchema) => {
      set({ data });
    },
  };
});

export default usePostFormStore;
