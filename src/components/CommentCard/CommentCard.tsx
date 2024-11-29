'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Comment } from '@prisma/client';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';
import usePostCard from '../PostCard/usePostCard';

const CommentCard = ({ comment }: { comment: Comment | null }): ReactNode => {
  const { post } = usePostCard();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      id: comment?.id,
      body: comment?.body || '',
      postId: post?.id,
      userId: comment?.userId,
    },
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleClick = () => {
    setIsEdit((isEdit) => !isEdit);
  };

  return (
    <div className='flex gap-2'>
      <Image
        src={defaultProfilePhoto}
        width={48}
        height={48}
        alt='Default profile photo'
        className='rounded-full'
      />
      {isEdit ? (
        <form className='flex-auto flex'>
          <input
            {...register('id')}
            name='id'
            className='hidden'
          />
          <input
            {...register('body')}
            name='body'
            className='flex-auto w-full'
          />
          <input
            {...register('postId')}
            name='postId'
            className='hidden'
          />
          <input
            {...register('userId')}
            name='userId'
            className='hidden'
          />
        </form>
      ) : (
        <p className='flex-auto text-sm'>{comment?.body}</p>
      )}
      <button onClick={handleClick}>
        <FaRegEdit
          className='self-center'
          size={16}
        />
      </button>
      <form
        // action={deleteCommentAction}
        className='flex'
      >
        <input
          value={comment?.id}
          name='id'
          readOnly
          className='hidden'
        />
        <button>
          <RiDeleteBin6Line
            className='self-center'
            size={16}
          />
        </button>
      </form>
    </div>
  );
};

export default CommentCard;
