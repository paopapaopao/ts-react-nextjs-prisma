import Image from 'next/image';
import { ReactNode } from 'react';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import useCommentCard from './useCommentCard';

interface Props {
  children: ReactNode;
}

const CommentCardUser = ({ children }: Props): ReactNode => {
  const { comment } = useCommentCard();

  const fullName: string = `${comment?.user.firstName} ${comment?.user.lastName}`;

  return (
    <div className='flex-auto flex gap-2'>
      <Image
        src={comment?.user.image || defaultProfilePhoto}
        width={40}
        height={40}
        alt='Default profile photo'
        className='self-start rounded-full'
      />
      <div className='p-2 flex flex-col gap-2 rounded-lg bg-zinc-700'>
        <span className='text-sm'>{fullName}</span>
        {children}
      </div>
    </div>
  );
};

export default CommentCardUser;
