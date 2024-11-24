import { type Comment, type Post } from '@prisma/client';

type PostWithComments = Post & {
  comments: Comment[];
};

export default PostWithComments;
