import { create } from 'zustand';

import { type PostSchema } from '../types';

type PostFormData = {
  data: PostSchema;
  setData: (data: PostSchema) => void;
};

const usePostFormData = create<PostFormData>((set) => ({
  data: {
    title: '',
    body: '',
    userId: 0,
    originalPostId: null,
    hasSharedPost: false,
  },
  setData: (data: PostSchema) => {
    set((previousData) => ({ ...previousData, ...data }));
  },
}));

export default usePostFormData;
