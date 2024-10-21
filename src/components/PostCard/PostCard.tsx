import clsx from 'clsx';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { type DummyJSONPost } from '@/types';
import styles from './PostCard.module.css';

interface Props {
  className?: string;
  isLink?: boolean;
  post: DummyJSONPost | null;
}

const PostCard = ({
  className = '',
  isLink = false,
  post,
}: Props): ReactNode => {
  const classNames: string = clsx(
    'post-card',
    styles['post-card'],
    isLink && styles['post-card-link'],
    `px-8 py-4 flex flex-col gap-4 bg-zinc-800 rounded-lg shadow-lg ${
      isLink && 'hover:shadow-xl'
    } text-white`,
    className
  );

  return isLink ? (
    <Link
      href={`/posts/${post?.id}`}
      className={classNames}
    >
      <h4 className={clsx('text-lg font-bold', styles.title)}>{post?.title}</h4>
      <p className='text-base'>{post?.body}</p>
    </Link>
  ) : (
    <div className={classNames}>
      <h4 className={clsx('text-lg font-bold')}>{post?.title}</h4>
      <p className='text-base'>{post?.body}</p>
    </div>
  );
};

export default PostCard;
