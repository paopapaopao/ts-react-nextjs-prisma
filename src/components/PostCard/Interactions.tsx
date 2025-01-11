'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegComment } from 'react-icons/fa';
import { GrDislike, GrLike } from 'react-icons/gr';
import { TbShare3 } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactionType } from '@prisma/client';

import { useCreatePost, useSignedInUser } from '@/lib/hooks';
import { postSchema } from '@/lib/schemas';
import { type PostSchema } from '@/lib/types';

import { ReactionButtonGroup } from '../ReactionButtonGroup';

import usePostCard from './usePostCard';

const Interactions = (): ReactNode => {
  const { post, onCommentFormToggle } = usePostCard();
  const { signedInUser } = useSignedInUser();

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: null,
      body: null,
      userId: signedInUser?.id,
      originalPostId: post?.id,
      hasSharedPost: true,
    },
  });

  const { mutate: createPost } = useCreatePost();

  const onSubmit = (data: PostSchema): void => {
    createPost(data, {
      onSuccess: (): void => {
        toast.success('Post shared successfully!');
      },
    });
  };

  const likeButtonColor: string =
    post && 'userReaction' in post && post.userReaction === ReactionType.LIKE
      ? 'green'
      : 'white';

  const dislikeButtonColor: string =
    post && 'userReaction' in post && post.userReaction === ReactionType.DISLIKE
      ? 'red'
      : 'white';

  const classNames: string = clsx(
    'mx-4 flex justify-between gap-4',
    'md:mx-6',
    'xl:mx-8'
  );

  return (
    <div className={classNames}>
      <ReactionButtonGroup postId={post?.id}>
        <button className='flex gap-2'>
          <GrLike
            size={24}
            color={likeButtonColor}
          />
          Like
        </button>
        <button className='flex gap-2'>
          <GrDislike
            size={24}
            color={dislikeButtonColor}
          />
          Dislike
        </button>
      </ReactionButtonGroup>
      <button
        onClick={onCommentFormToggle}
        className='flex gap-2'
      >
        <FaRegComment size={24} />
        Comment
      </button>
      {!post?.hasSharedPost && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            disabled={isSubmitting}
            className='flex gap-2'
          >
            <TbShare3 size={24} />
            Share
          </button>
        </form>
      )}
    </div>
  );
};

export default Interactions;
