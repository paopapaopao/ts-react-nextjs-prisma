'use client';

import { type Context, createContext } from 'react';
import { type PostWithComments } from '@/lib/types';

type Value = { post: PostWithComments | null };

const PostCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default PostCardContext;
