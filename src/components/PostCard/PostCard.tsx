'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { Mode } from '@/lib/enumerations';
import { useSignedInUser } from '@/lib/hooks';
import type { PostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import { CommentForm } from '../CommentForm/CommentForm';
import { CommentList } from '../CommentList/CommentList';

import { Actions } from './Actions';
import { Form } from './Form';
import { Interactions } from './Interactions';
import { PostCardContext } from './PostCardContext';
import { Stats } from './Stats';
import { User } from './User';
import { View } from './View';

type Props = {
  className?: string;
  post: PostWithRelationsAndRelationCountsAndUserReaction;
};

export const PostCard = ({ className = '', post }: Props): ReactNode => {
  const { signedInUser } = useSignedInUser();

  const [mode, setMode] = useState(Mode.VIEW);
  const [isCommentListShown, setIsCommentListShown] = useState(false);
  const [isCommentFormShown, setIsCommentFormShown] = useState(false);

  const handleModeToggle = (): void => {
    setMode((mode: Mode) => (mode === Mode.VIEW ? Mode.EDIT : Mode.VIEW));
  };

  const handleSuccess = (): void => {
    setMode(Mode.VIEW);
  };

  const handleCommentListToggle = (): void => {
    setIsCommentListShown((isCommentListShown: boolean) => !isCommentListShown);
  };

  const handleCommentFormToggle = (): void => {
    setIsCommentFormShown((isCommentFormShown: boolean) => !isCommentFormShown);
  };

  const isSignedInUserPost = signedInUser?.id === post?.userId;
  const hasReactions = (post?._count.reactions ?? 0) > 0;
  const hasComments = (post?._count.comments ?? 0) > 0;
  const hasShares = (post?._count.shares ?? 0) > 0;
  const hasViews = (post?._count.views ?? 0) > 0;

  const classNames = clsx(
    'px-2 py-2 flex flex-col gap-2',
    'md:px-5 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-card',
    className
  );

  const noticeClassNames = clsx(
    'px-2 py-2',
    'md:px-5 md:py-3',
    'xl:px-8 xl:py-4',
    'text-card-foreground'
  );

  const formGroupClassNames = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  return (
    <PostCardContext.Provider
      value={{
        post,
        hasReactions,
        hasComments,
        hasShares,
        hasViews,
        onModeToggle: handleModeToggle,
        onSuccess: handleSuccess,
        onCommentListToggle: handleCommentListToggle,
        onCommentFormToggle: handleCommentFormToggle,
      }}
    >
      <div className={classNames}>
        <div className='flex justify-between gap-4'>
          <User />
          {isSignedInUserPost && <Actions />}
        </div>
        {post?.hasSharedPost ? (
          post?.originalPost ? (
            <PostCardContext.Provider value={{ post: post?.originalPost }}>
              <div className={classNames}>
                <User />
                <View />
              </div>
            </PostCardContext.Provider>
          ) : (
            <p className={noticeClassNames}>
              <span className='text-red-600'>Notice!</span> The shared post has
              already been deleted.
            </p>
          )
        ) : mode === Mode.VIEW ? (
          <View />
        ) : (
          <Form />
        )}
        {(hasReactions || hasComments || hasShares || hasViews) && <Stats />}
        <hr />
        <Interactions />
        {(isCommentListShown || isCommentFormShown) && <hr />}
        {isCommentListShown && <CommentList />}
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
