'use client';

import clsx from 'clsx';
import Image from 'next/image';
import {
  type ReactNode,
  startTransition,
  useEffect,
  useOptimistic,
  useState,
} from 'react';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { Mode } from '@/lib/enums';
import { useSignedInUser } from '@/lib/hooks';
import { usePostMutationStore } from '@/lib/stores';
import {
  type PostMutationStore,
  type PostSchema,
  type PostWithRelationsAndRelationCountsAndUserReaction,
} from '@/lib/types';

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

  const postMutationData: PostSchema | null = usePostMutationStore(
    (state: PostMutationStore): PostSchema | null => state.data
  );

  const [optimisticData, setOptimisticData] =
    useOptimistic<PostWithRelationsAndRelationCountsAndUserReaction>(post);

  const [mode, setMode] = useState<Mode>(Mode.VIEW);
  const [isCommentListShown, setIsCommentListShown] = useState<boolean>(false);
  const [isCommentFormShown, setIsCommentFormShown] = useState<boolean>(false);

  useEffect((): void => {
    startTransition((): void => {
      setOptimisticData(
        (
          optimisticData: PostWithRelationsAndRelationCountsAndUserReaction
        ): PostWithRelationsAndRelationCountsAndUserReaction => {
          if (optimisticData === null) {
            return null;
          }

          return {
            ...optimisticData,
            ...postMutationData,
          };
        }
      );
    });
  }, [postMutationData, setOptimisticData]);

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

  const isSignedInUserPost: boolean =
    signedInUser?.id === optimisticData?.userId;

  const hasReactions: boolean = (optimisticData?._count.reactions ?? 0) > 0;
  const hasComments: boolean = (optimisticData?._count.comments ?? 0) > 0;
  const hasShares: boolean = (optimisticData?._count.shares ?? 0) > 0;
  const hasViews: boolean = (optimisticData?._count.views ?? 0) > 0;

  const classNames: string = clsx(
    'px-2 py-2 flex flex-col gap-2',
    'md:px-5 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800 text-white',
    className
  );

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

  return (
    <PostCardContext.Provider
      value={{
        post: optimisticData,
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
        {optimisticData?.hasSharedPost ? (
          optimisticData?.originalPost ? (
            <PostCardContext.Provider
              value={{ post: optimisticData?.originalPost }}
            >
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

export default PostCard;
