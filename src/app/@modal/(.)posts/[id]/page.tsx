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
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { CommentForm, CommentList, Modal } from '@/components';
import { type PostWithUserAndCommentsCountAndReactionCounts } from '@/lib/types';
import PostCardContext from '@/components/PostCard/PostCardContext';

interface Props {
  params: { id: string };
}

// TODO
const Page = ({ params: { id } }: Props): ReactNode => {
  const [post, setPost] =
    useState<PostWithUserAndCommentsCountAndReactionCounts | null>(null);
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

  const hasReactions: boolean =
    (post?.reactionCounts?.LIKE ?? 0) > 0 ||
    (post?.reactionCounts?.DISLIKE ?? 0) > 0;
  const hasComments: boolean | null | undefined =
    post && post._count && post._count.comments > 0;

  const classNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return (
    <PostCardContext.Provider value={{ post }}>
      <Modal innerRef={ref}>
        <Modal.Title onClick={handleCloseClick}>{post?.title}</Modal.Title>
        <Modal.Content className={classNames}>
          <p className='text-base'>{post?.body}</p>
          {(hasReactions || hasComments) && (
            <div className='flex justify-between gap-2'>
              {hasReactions && (
                <div className='flex gap-2'>
                  <span className='self-end text-sm'>{`${post?.reactionCounts.LIKE} likes`}</span>
                  <span className='self-end text-sm'>{`${post?.reactionCounts.DISLIKE} dislikes`}</span>
                </div>
              )}
              {hasComments && (
                <button
                  onClick={handleCommentListToggle}
                  className='self-end text-sm'
                >{`${post?._count?.comments} comments`}</button>
              )}
            </div>
          )}
          {isCommentListShown && <CommentList />}
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
              <CommentForm className='flex-auto' />
            </div>
          )}
        </Modal.Content>
      </Modal>
    </PostCardContext.Provider>
  );
};

export default Page;
