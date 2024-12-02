import clsx from 'clsx';
import { type ReactNode } from 'react';
import usePostCard from './usePostCard';

const PostCardView = (): ReactNode => {
  const { post } = usePostCard();

  const classNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return (
    <div className={classNames}>
      <h4 className='text-lg font-bold'>{post?.title}</h4>
      <p className='text-base'>{post?.body}</p>
    </div>
  );
};

export default PostCardView;
