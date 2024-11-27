'use client';

import clsx from 'clsx';
import Image from 'next/image';
import {
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FaRegComment } from 'react-icons/fa';
import { type Comment } from '@prisma/client';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { CommentForm, Modal } from '@/components';
import { type PostWithComments } from '@/lib/types';

interface Props {
  params: { id: string };
}

// TODO
const Page = ({ params: { id } }: Props): ReactNode => {
  const [post, setPost] = useState<PostWithComments>(null);
  const [isCommentListShown, setIsCommentListShown] = useState<boolean>(false);
  const [isCommentFormShown, setIsCommentFormShown] = useState<boolean>(false);

  const ref: MutableRefObject<HTMLDialogElement | null> =
    useRef<HTMLDialogElement | null>(null);

  useEffect((): void => {
    const getPost = async (): Promise<void> => {
      const response: Response = await fetch(`/api/posts/${id}`);
      const data = await response.json();

      setPost(data.data.post);
    };

    getPost();
  }, [id]);

  useEffect((): void => {
    if (ref.current !== null) {
      ref.current.showModal();
    }
  }, [ref]);

  const handleCommentListToggle = (): void => {
    setIsCommentListShown((isCommentListShown: boolean) => !isCommentListShown);
  };

  const handleCommentFormToggle = (): void => {
    setIsCommentFormShown((isCommentFormShown: boolean) => !isCommentFormShown);
  };

  const handleCloseClick = (): void => {
    ref?.current?.close();
  };

  const hasComments: boolean | null =
    post && post.comments && post.comments.length > 0;
  const commentsCount: number | undefined = post?.comments.length;

  const classNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return (
    <Modal innerRef={ref}>
      <Modal.Title onClick={handleCloseClick}>{post?.title}</Modal.Title>
      <Modal.Content className={classNames}>
        <p className='text-base'>{post?.body}</p>
        {hasComments && (
          <span
            onClick={handleCommentListToggle}
            className='self-end text-sm cursor-pointer'
          >{`${commentsCount} comments`}</span>
        )}
        {isCommentListShown && (
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
                  <p className='text-sm'>{comment.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <hr />
        <div className='self-center flex gap-2 items-center'>
          <div className='flex gap-2 items-center cursor-pointer'>
            <FaRegComment size={24} />
            <span onClick={handleCommentFormToggle}>Comment</span>
          </div>
        </div>
        {isCommentFormShown && (
          <div className='self-stretch flex gap-2'>
            <Image
              src={defaultProfilePhoto}
              width={48}
              height={48}
              alt='Default profile photo'
              className='self-start rounded-full'
            />
            <CommentForm
              postId={post?.id}
              className='flex-auto'
            />
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
};

export default Page;
