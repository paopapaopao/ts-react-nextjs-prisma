'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { useUser } from '@clerk/nextjs';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { type CommentWithUserAndReplyCount } from '@/lib/types';

import { CommentForm } from '../CommentForm';

import CommentCardActions from './CommentCardActions';
import CommentCardContext from './CommentCardContext';
import CommentCardForm from './CommentCardForm';
import CommentCardInteractions from './CommentCardInteractions';
import CommentCardReplyList from './CommentCardReplyList';
import CommentCardUser from './CommentCardUser';
import CommentCardView from './CommentCardView';

type Props = { comment: CommentWithUserAndReplyCount };

const CommentCard = ({ comment }: Props): ReactNode => {
  const { user } = useUser();

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

  const isSignedInUserComment: boolean = user?.id === comment?.clerkUserId;

  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

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
          <CommentCardUser>
            {mode === 'VIEW' ? <CommentCardView /> : <CommentCardForm />}
          </CommentCardUser>
          {isSignedInUserComment && <CommentCardActions />}
        </div>
        <CommentCardInteractions />
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
              src={defaultProfilePhoto}
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
