'use client';

import {
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { type Post } from '@prisma/client';
import { Modal } from '@/components';
import { type PostWithComments } from '@/lib/types';

interface Props {
  params: { id: string };
}

// TODO
const Page = ({ params: { id } }: Props): ReactNode => {
  const [post, setPost] = useState<Post | PostWithComments | null>(null);
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

  const handleClick = (): void => {
    ref?.current?.close();
  };

  return (
    <Modal innerRef={ref}>
      <Modal.Title onClick={handleClick}>{post?.title}</Modal.Title>
      <Modal.Content>
        <p>{post?.body}</p>
      </Modal.Content>
    </Modal>
  );
};

export default Page;
