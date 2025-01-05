'use client';

import { type ReactNode } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { GrDislike } from 'react-icons/gr';
import { GrLike } from 'react-icons/gr';
import { ReactionType } from '@prisma/client';

import { ReactionButtonGroup } from '../ReactionButtonGroup';

import usePostCard from './usePostCard';

const Interactions = (): ReactNode => {
  const { post, onCommentFormToggle } = usePostCard();

  return (
    <div className='flex justify-between gap-4'>
      <ReactionButtonGroup postId={post?.id}>
        <button className='flex gap-2'>
          <GrLike
            size={24}
            color={post?.userReaction === ReactionType.LIKE ? 'green' : 'white'}
          />
          Like
        </button>
        <button className='flex gap-2'>
          <GrDislike
            size={24}
            color={
              post?.userReaction === ReactionType.DISLIKE ? 'red' : 'white'
            }
          />
          Dislike
        </button>
      </ReactionButtonGroup>
      <button
        onClick={onCommentFormToggle}
        className='flex gap-2'
      >
        <FaRegComment size={24} />
        Comment
      </button>
    </div>
  );
};

export default Interactions;
