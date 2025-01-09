'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { useSignedInUser } from '@/lib/hooks';
import { type CommentWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import { CommentForm } from '../CommentForm';

import Actions from './Actions';
import CommentCardContext from './CommentCardContext';
import CommentCardReplyList from './CommentCardReplyList';
import Form from './Form';
import Interactions from './Interactions';
import Stats from './Stats';
import User from './User';
import View from './View';

type Props = {
  comment: CommentWithRelationsAndRelationCountsAndUserReaction;
};

const CommentCard = ({ comment }: Props): ReactNode => {
  const { signedInUser } = useSignedInUser();

  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');
  const [isReplyListShown, setIsReplyListShown] = useState<boolean>(false);
  const [isReplyFormShown, setIsReplyFormShown] = useState<boolean>(false);

  const handleModeToggle = (): void => {
    setMode((mode: 'VIEW' | 'EDIT') => (mode === 'VIEW' ? 'EDIT' : 'VIEW'));
  };

  const handleSuccess = (): void => {
    setMode('VIEW');
  };

  const handleReplyListToggle = (): void => {
    setIsReplyListShown((isReplyListShown: boolean) => !isReplyListShown);
  };

  const handleReplyFormToggle = (): void => {
    setIsReplyFormShown((isReplyFormShown: boolean) => !isReplyFormShown);
  };

  const isSignedInUserComment: boolean = signedInUser?.id === comment?.userId;

  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  const hasReactions: boolean =
    comment.reactionCounts.LIKE > 0 || comment.reactionCounts.DISLIKE > 0;

  const hasReplies: boolean = (comment._count?.replies ?? 0) > 0;

  return (
    <CommentCardContext.Provider
      value={{
        comment,
        onModeToggle: handleModeToggle,
        onSuccess: handleSuccess,
        onReplyListToggle: handleReplyListToggle,
        onReplyFormToggle: handleReplyFormToggle,
      }}
    >
      <div className={clsx(classNames, 'flex-col')}>
        <div className={classNames}>
          <User>{mode === 'VIEW' ? <View /> : <Form />}</User>
          {isSignedInUserComment && <Actions />}
        </div>
        <div className='flex gap-4'>
          <Interactions />
          {(hasReactions || hasReplies) && <Stats />}
        </div>
        {isReplyListShown && <CommentCardReplyList />}
        {isReplyFormShown && (
          <div
            className={clsx(
              'ms-12 flex gap-2',
              'md:ms-[52px] md:gap-3',
              'xl:ms-14 xl:gap-4'
            )}
          >
            <Image
              src={signedInUser?.image || defaultProfilePhoto}
              alt='Profile photo'
              width={40}
              height={40}
              className='self-start rounded-full'
            />
            <CommentForm parentCommentId={comment?.id} />
          </div>
        )}
      </div>
    </CommentCardContext.Provider>
  );
};

export default CommentCard;
