'use client';

import { type Context, createContext } from 'react';
import { type PostWithUserAndCommentsCount } from '@/lib/types';

type Value = { post: PostWithUserAndCommentsCount };

const PostCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default PostCardContext;
