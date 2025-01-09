'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { useSignedInUser } from '@/lib/hooks';
import { type PostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import { CommentForm } from '../CommentForm';
import { CommentList } from '../CommentList';

import Actions from './Actions';
import Form from './Form';
import Interactions from './Interactions';
import PostCardContext from './PostCardContext';
import SharedPostCard from './SharedPostCard';
import Stats from './Stats';
import User from './User';
import View from './View';

type Props = {
  className?: string;
  post: PostWithRelationsAndRelationCountsAndUserReaction;
};

const PostCard = ({ className = '', post }: Props): ReactNode => {
  const { signedInUser } = useSignedInUser();

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

  const hasName: boolean =
    post?.user?.firstName !== null && post?.user?.lastName !== null;
  const isSignedInUserPost: boolean = signedInUser?.id === post?.userId;
  const isASharePost: boolean = post?.originalPost !== null;
  const hasReactions: boolean = (post?._count?.reactions ?? 0) > 0;
  const hasComments: boolean = (post?._count?.comments ?? 0) > 0;
  const hasShares: boolean = (post?._count?.shares ?? 0) > 0;

  const formGroupClassNames: string = clsx(
    'flex gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  const postCardClassNames: string = clsx(
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
        postStates: {
          hasName,
          isASharePost,
          hasReactions,
          hasComments,
          hasShares,
        },
        onModeToggle: handleModeToggle,
        onSuccess: handleSuccess,
        onCommentListToggle: handleCommentListToggle,
        onCommentFormToggle: handleCommentFormToggle,
      }}
    >
      <div className={postCardClassNames}>
        <div className='flex justify-between gap-4'>
          <User />
          {isSignedInUserPost && <Actions />}
        </div>
        {mode === 'VIEW' ? post?.originalPost === null && <View /> : <Form />}
        {isASharePost && <SharedPostCard post={post?.originalPost} />}
        {(hasReactions || hasComments || hasShares) && <Stats />}
        <hr />
        <Interactions />
        {isCommentListShown && (
          <>
            <hr />
            <CommentList />
          </>
        )}
        {isCommentFormShown && (
          <div className={formGroupClassNames}>
            <Image
              src={signedInUser?.image || defaultProfilePhoto}
              alt='Profile photo'
              width={40}
              height={40}
              className='self-start rounded-full'
            />
            <CommentForm />
          </div>
        )}
      </div>
    </PostCardContext.Provider>
  );
};

export default PostCard;
