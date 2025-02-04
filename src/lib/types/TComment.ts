import { type Comment } from '@prisma/client';

type TComment = {
  data: { comment: Comment | null } | null;
  errors: { [key: string]: string[] } | null;
};

export default TComment;
