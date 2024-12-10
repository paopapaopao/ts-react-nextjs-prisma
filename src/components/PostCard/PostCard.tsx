'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { type PostWithUserAndCommentsCountAndReactionCounts } from '@/lib/types';
import { CommentForm } from '../CommentForm';
import { CommentList } from '../CommentList';
import PostCardActions from './PostCardActions';
import PostCardContext from './PostCardContext';
import PostCardForm from './PostCardForm';
import PostCardInteractions from './PostCardInteractions';
import PostCardUser from './PostCardUser';
import PostCardView from './PostCardView';

interface Props {
  className?: string;
  post: PostWithUserAndCommentsCountAndReactionCounts;
}

const PostCard = ({ className = '', post }: Props): ReactNode => {
  const { user } = useUser();

  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');
  const [isCommentListShown, setIsCommentListShown] = useState<boolean>(false);
  const [isCommentFormShown, setIsCommentFormShown] = useState<boolean>(false);

  const handleModeToggle = (): void => {
    setMode((mode: 'VIEW' | 'EDIT') => (mode === 'VIEW' ? 'EDIT' : 'VIEW'));
  };

  const handleSuccess = (): void => {
    setMode('VIEW');
  };

  const handleCommentListToggle = (): void => {
    setIsCommentListShown((isCommentListShown: boolean) => !isCommentListShown);
  };

  const handleCommentFormToggle = (): void => {
    setIsCommentFormShown((isCommentFormShown: boolean) => !isCommentFormShown);
  };

  const isSignedInUserPost: boolean = post?.clerkUserId === user?.id;

  const hasReactions: boolean =
    post?.reactionCounts.LIKE > 0 || post?.reactionCounts.DISLIKE > 0;

  const hasComments: boolean | undefined =
    post && post._count && post._count.comments > 0;

  const classNames: string = clsx(
    'px-2 py-2 flex flex-col gap-2',
    'md:px-5 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800 text-white',
    className
  );

  return (
    <PostCardContext.Provider
      value={{
        post,
        onModeToggle: handleModeToggle,
        onSuccess: handleSuccess,
        onCommentListToggle: handleCommentListToggle,
      }}
    >
      <div className={classNames}>
        <div className='flex justify-between gap-2'>
          <PostCardUser />
          {isSignedInUserPost && <PostCardActions />}
        </div>
        {mode === 'VIEW' ? <PostCardView /> : <PostCardForm />}
        {(hasReactions || hasComments) && <PostCardInteractions />}
        {isCommentListShown && <CommentList />}
        <hr />
        <div className='self-center flex gap-2 items-center'>
          <button className='flex gap-2 items-center'>
            <FaRegComment size={24} />
            <span onClick={handleCommentFormToggle}>Comment</span>
          </button>
        </div>
        {isCommentFormShown && (
          <div className='self-stretch flex gap-2'>
            <Image
              src={defaultProfilePhoto}
              alt='Profile photo'
              width={40}
              height={40}
              className='self-start rounded-full'
            />
            <CommentForm className='flex-auto px-2 md:px-4' />
          </div>
        )}
      </div>
    </PostCardContext.Provider>
  );
};

export default PostCard;
