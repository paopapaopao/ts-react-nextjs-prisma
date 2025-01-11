'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { Mode } from '@/lib/enums';
import { useSignedInUser } from '@/lib/hooks';
import { type PostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import { CommentForm } from '../CommentForm';
import { CommentList } from '../CommentList';

import Actions from './Actions';
import Form from './Form';
import Interactions from './Interactions';
import PostCardContext from './PostCardContext';
import Stats from './Stats';
import User from './User';
import View from './View';

type Props = {
  className?: string;
  post: PostWithRelationsAndRelationCountsAndUserReaction;
};

const PostCard = ({ className = '', post }: Props): ReactNode => {
  const { signedInUser } = useSignedInUser();

  const [mode, setMode] = useState<Mode>(Mode.VIEW);
  const [isCommentListShown, setIsCommentListShown] = useState<boolean>(false);
  const [isCommentFormShown, setIsCommentFormShown] = useState<boolean>(false);

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

  const isSignedInUserPost: boolean = signedInUser?.id === post?.userId;
  const hasReactions: boolean = (post?._count.reactions ?? 0) > 0;
  const hasComments: boolean = (post?._count.comments ?? 0) > 0;
  const hasShares: boolean = (post?._count.shares ?? 0) > 0;
  const hasViews: boolean = (post?._count.views ?? 0) > 0;

  const noticeClassNames: string = clsx(
    'px-2 py-2',
    'md:px-5 md:py-3',
    'xl:px-8 xl:py-4'
  );

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
        postStats: {
          hasReactions,
          hasComments,
          hasShares,
          hasViews,
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
        {post?.hasSharedPost ? (
          post?.originalPost ? (
            <PostCardContext.Provider value={{ post: post?.originalPost }}>
              <div className={postCardClassNames}>
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

export default PostCard;
