import type PostWithRelationsAndRelationCountsAndUserReaction from './PostWithRelationsAndRelationCountsAndUserReaction';

type TPosts = {
  data: {
    nextCursor: number | null;
    posts: PostWithRelationsAndRelationCountsAndUserReaction[];
  } | null;
  errors: { [key: string]: string[] } | null;
};

export default TPosts;
