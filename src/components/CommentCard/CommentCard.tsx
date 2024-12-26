'use client';

import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
import { useUser } from '@clerk/nextjs';

import { type CommentWithUserAndReplyCount } from '@/lib/types';

import CommentCardActions from './CommentCardActions';
import CommentCardContext from './CommentCardContext';
import CommentCardForm from './CommentCardForm';
import CommentCardInteractions from './CommentCardInteractions';
import CommentCardReplyList from './CommentCardReplyList';
import CommentCardUser from './CommentCardUser';
import CommentCardView from './CommentCardView';

interface Props {
  comment: CommentWithUserAndReplyCount;
}

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

  const hasReplies: boolean | null =
    comment && comment._count && comment._count.replies > 0;

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
        {hasReplies && <CommentCardInteractions />}
        {isShown && <CommentCardReplyList />}
      </div>
    </CommentCardContext.Provider>
  );
};

export default CommentCard;
