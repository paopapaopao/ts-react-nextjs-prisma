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

interface Props {
  params: {
    id: string;
  };
}

const Page = ({ params: { id } }: Props): ReactNode => {
  const [post, setPost] = useState<Post | null>(null);
  const ref: MutableRefObject<HTMLDialogElement | null> =
    useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const getPost = async () => {
      const response: Response = await fetch(`/api/posts/${id}`);
      const data = await response.json();

      setPost(data.data);
    };

    getPost();
  }, [id]);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.showModal();
    }
  }, [ref]);

  const handleClick = () => {
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
