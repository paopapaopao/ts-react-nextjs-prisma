import clsx from 'clsx';
import Image from 'next/image';
import { ReactNode } from 'react';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import usePostCard from './usePostCard';

interface Props {
  className?: string;
}

const PostCardUser = ({ className = '' }: Props): ReactNode => {
  const { post } = usePostCard();

  const classNames: string = clsx(
    'flex gap-2',
    'md:gap-3',
    'xl:gap-4',
    className
  );

  const fullName: string = `${post?.user.firstName} ${post?.user.lastName}`;

  return (
    <div className={classNames}>
      <Image
        src={post?.user.image || defaultProfilePhoto}
        width={48}
        height={48}
        alt='Profile photo'
        className='rounded-full'
      />
      <span>{fullName}</span>
    </div>
  );
};

export default PostCardUser;
