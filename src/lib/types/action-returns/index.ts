import { Prisma } from '@prisma/client';

import {
  readCommentWithRelationsAndRelationCountsAndUserReaction,
  readPostWithRelationsAndRelationCountsAndUserReaction,
} from '@/lib/actions';

export type CommentWithRelationsAndRelationCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readCommentWithRelationsAndRelationCountsAndUserReaction
  >;

export type PostWithRelationsAndRelationCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readPostWithRelationsAndRelationCountsAndUserReaction
  >;
