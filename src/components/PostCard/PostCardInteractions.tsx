'use client';

import { type ReactNode } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { GrDislike } from 'react-icons/gr';
import { GrLike } from 'react-icons/gr';
import { ReactionType } from '@prisma/client';

import { ReactionButtonGroup } from '../ReactionButtonGroup';

import usePostCard from './usePostCard';

const PostCardInteractions = (): ReactNode => {
  const { post, onCommentFormToggle } = usePostCard();

  return (
    <div className='flex justify-between items-center gap-2'>
      <ReactionButtonGroup postId={post?.id}>
        <button className='flex items-center gap-2'>
          <GrLike
            size={24}
            color={post?.userReaction === ReactionType.LIKE ? 'green' : 'white'}
          />
          <span>Like</span>
        </button>
        <button className='flex items-center gap-2'>
          <GrDislike
            size={24}
            color={
              post?.userReaction === ReactionType.DISLIKE ? 'red' : 'white'
            }
          />
          <span>Dislike</span>
        </button>
      </ReactionButtonGroup>
      <button
        onClick={onCommentFormToggle}
        className='flex items-center gap-2'
      >
        <FaRegComment size={24} />
        <span>Comment</span>
      </button>
    </div>
  );
};

export default PostCardInteractions;
