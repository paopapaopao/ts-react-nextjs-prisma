import { type Post } from '@prisma/client';

type TPost = {
  data: { post: Post | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
};

export default TPost;
