'use client';

import { type ReactNode } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { GrDislike, GrLike } from 'react-icons/gr';
import { ReactionType } from '@prisma/client';

import { ReactionButtonGroup } from '../ReactionButtonGroup';

import usePostCard from './usePostCard';

const Interactions = (): ReactNode => {
  const { post, onCommentFormToggle } = usePostCard();

  const likeButtonColor: string =
    post?.userReaction === ReactionType.LIKE ? 'green' : 'white';

  const dislikeButtonColor: string =
    post?.userReaction === ReactionType.DISLIKE ? 'red' : 'white';

  return (
    <div className='flex justify-between gap-4'>
      <ReactionButtonGroup postId={post?.id}>
        <button className='flex gap-2'>
          <GrLike
            size={24}
            color={likeButtonColor}
          />
          Like
        </button>
        <button className='flex gap-2'>
          <GrDislike
            size={24}
            color={dislikeButtonColor}
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
