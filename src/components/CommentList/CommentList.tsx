import Image from 'next/image';
import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { type Comment } from '@prisma/client';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import usePostCard from '../PostCard/usePostCard';

// TODO
const CommentList = (): ReactNode => {
  const { post } = usePostCard();

  const deleteCommentAction = async (formData: FormData): Promise<void> => {
    const data = Object.fromEntries(formData);

    await fetch(`/api/comments/${data.id}`, { method: 'DELETE' });
  };

  return (
    <ul className='flex flex-col gap-2'>
      {post?.comments.map((comment: Comment) => (
        <li key={comment.id}>
          <div className='flex gap-2'>
            <Image
              src={defaultProfilePhoto}
              width={48}
              height={48}
              alt='Default profile photo'
              className='rounded-full'
            />
            <p className='flex-auto text-sm'>{comment.body}</p>
            <button>
              <FaRegEdit
                className='self-center'
                size={16}
              />
            </button>
            <form
              action={deleteCommentAction}
              className='flex'
            >
              <input
                value={comment.id}
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
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
