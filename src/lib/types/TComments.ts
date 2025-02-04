import type CommentWithRelationsAndRelationCountsAndUserReaction from './CommentWithRelationsAndRelationCountsAndUserReaction';

type TComments = {
  data: {
    comments: CommentWithRelationsAndRelationCountsAndUserReaction[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
};

export default TComments;
