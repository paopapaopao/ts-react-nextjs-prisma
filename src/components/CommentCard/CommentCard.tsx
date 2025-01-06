'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { useSignedInUser } from '@/lib/hooks';
import { type CommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction } from '@/lib/types';

import { CommentForm } from '../CommentForm';

import Actions from './Actions';
import CommentCardContext from './CommentCardContext';
import CommentCardReplyList from './CommentCardReplyList';
import Form from './Form';
import Interactions from './Interactions';
import User from './User';
import View from './View';

type Props = {
  comment: CommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction;
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

  //
  const hasReplies: boolean | null =
    comment && comment._count && comment._count.replies > 0;

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
        <Interactions />
        {/*  */}
        {hasReplies && (
          <span
            onClick={handleReplyListToggle}
            className={clsx(
              'ms-12',
              'md:ms-[52px]',
              'xl:ms-14',
              'text-xs cursor-pointer'
            )}
          >
            {`View ${comment?._count.replies} replies`}
          </span>
        )}
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
