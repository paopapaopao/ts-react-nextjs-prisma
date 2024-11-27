import Image from 'next/image';
import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { type Comment } from '@prisma/client';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';

interface Props {
  comments: Comment[] | undefined;
}

const CommentList = ({ comments }: Props): ReactNode => {
  return (
    <ul className='flex flex-col gap-2'>
      {comments?.map((comment: Comment) => (
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
            <button>
              <RiDeleteBin6Line
                className='self-center'
                size={16}
              />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
