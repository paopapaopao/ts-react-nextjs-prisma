'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { type PostWithUserAndCommentsCount } from '@/lib/types';
import { CommentForm } from '../CommentForm';
import { CommentList } from '../CommentList';
import { PostForm } from '../PostForm';
import PostCardActions from './PostCardActions';
import PostCardContext from './PostCardContext';
import PostCardUser from './PostCardUser';
import PostCardView from './PostCardView';

interface Props {
  className?: string;
  post: PostWithUserAndCommentsCount;
}

const PostCard = ({ className = '', post }: Props): ReactNode => {
  const { user } = useUser();

  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');
  const [isCommentListShown, setIsCommentListShown] = useState<boolean>(false);
  const [isCommentFormShown, setIsCommentFormShown] = useState<boolean>(false);

  const handlePostModeToggle = (): void => {
    setMode((mode: 'VIEW' | 'EDIT') => (mode === 'VIEW' ? 'EDIT' : 'VIEW'));
  };

  const handleCommentListToggle = (): void => {
    setIsCommentListShown((isCommentListShown: boolean) => !isCommentListShown);
  };

  const handleCommentFormToggle = (): void => {
    setIsCommentFormShown((isCommentFormShown: boolean) => !isCommentFormShown);
  };

  const hasComments: boolean | null =
    post && post._count && post._count.comments > 0;
  const commentsCount: number | undefined = post?._count.comments;

  const classNames: string = clsx(
    'px-2 py-2 flex flex-col gap-2',
    'md:px-5 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800 text-white',
    className
  );

  const isSignedInUserPost: boolean = post?.clerkUserId === user?.id;

  return (
    <PostCardContext.Provider value={{ post }}>
      <div className={classNames}>
        <div className='flex justify-between gap-2'>
          <PostCardUser />
          {isSignedInUserPost && (
            <PostCardActions onToggle={handlePostModeToggle} />
          )}
        </div>
        {mode === 'VIEW' ? <PostCardView /> : <PostForm post={post} />}
        {hasComments && (
          <button
            onClick={handleCommentListToggle}
            className='self-end text-sm'
          >{`${commentsCount} comments`}</button>
        )}
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
              width={48}
              height={48}
              alt='Default profile photo'
              className='self-start rounded-full'
            />
            <CommentForm className='flex-auto' />
          </div>
        )}
      </div>
    </PostCardContext.Provider>
  );
};

export default PostCard;
