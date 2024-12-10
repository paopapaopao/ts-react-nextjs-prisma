'use client';

import clsx from 'clsx';
import {
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal, PostCard, PostCardSkeleton } from '@/components';

interface Props {
  params: { id: string };
}

const Page = ({ params: { id } }: Props): ReactNode => {
  // TODO
  const getPost = async () => {
    const response: Response = await fetch(`/api/posts/${id}`);
    const data = await response.json();

    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: getPost,
  });

  const ref: MutableRefObject<HTMLDialogElement | null> =
    useRef<HTMLDialogElement | null>(null);

  useEffect((): void => {
    if (ref.current !== null) {
      ref.current.showModal();
    }
  }, [ref]);

  const handleCloseClick = (): void => {
    ref?.current?.close();
  };

  const classNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return (
    <Modal innerRef={ref}>
      <Modal.Title onClick={handleCloseClick} />
      <Modal.Content className={classNames}>
        {isLoading ? (
          <PostCardSkeleton />
        ) : (
          <PostCard post={data?.data?.post} />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default Page;
