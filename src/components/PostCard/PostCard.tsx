'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { type PostWithComments } from '@/lib/types';
import { CommentForm } from '../CommentForm';
import { CommentList } from '../CommentList';

interface Props {
  post: PostWithComments | null;
}

const PostCard = ({ post }: Props): ReactNode => {
  const [isCommentListShown, setIsCommentListShown] = useState<boolean>(false);
  const [isCommentFormShown, setIsCommentFormShown] = useState<boolean>(false);

  const handleCommentListToggle = (): void => {
    setIsCommentListShown((isCommentListShown: boolean) => !isCommentListShown);
  };

  const handleCommentFormToggle = (): void => {
    setIsCommentFormShown((isCommentFormShown: boolean) => !isCommentFormShown);
  };

  const hasComments: boolean | null =
    post && post.comments && post.comments.length > 0;
  const commentsCount: number | undefined = post?.comments.length;

  const classNames: string = clsx(
    'px-4 py-2 min-w-[344px] w-full max-w-screen-xl flex flex-col gap-2',
    'md:px-6 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800 text-white'
  );

  return (
    <div className={classNames}>
      <h4 className='text-lg font-bold'>{post?.title}</h4>
      <p className='text-base'>{post?.body}</p>
      {hasComments && (
        <span
          onClick={handleCommentListToggle}
          className='self-end text-sm cursor-pointer'
        >{`${commentsCount} comments`}</span>
      )}
      {isCommentListShown && <CommentList comments={post?.comments} />}
      <hr />
      <div className='self-center flex gap-2 items-center'>
        <div className='flex gap-2 items-center cursor-pointer'>
          <FaRegComment size={24} />
          <span onClick={handleCommentFormToggle}>Comment</span>
        </div>
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
          <CommentForm
            postId={post?.id}
            className='flex-auto'
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
