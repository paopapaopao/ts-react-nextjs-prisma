'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import {
  type MutableRefObject,
  type ReactNode,
  use,
  useEffect,
  useRef,
} from 'react';
import { useQuery } from '@tanstack/react-query';

import { Popover, PostCard, PostCardSkeleton } from '@/components';
import { QueryKey } from '@/lib/enums';

type Props = {
  params: Promise<{ id: string }>;
};

const Page = (props: Props): ReactNode => {
  const params = use(props.params);
  const { id } = params;

  // TODO
  const getPost = async () => {
    const response: Response = await fetch(`/api/posts/${id}`);
    const data = await response.json();

    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.POST, id],
    queryFn: getPost,
  });

  const ref: MutableRefObject<HTMLDialogElement | null> =
    useRef<HTMLDialogElement | null>(null);

  useEffect((): void => {
    if (ref.current !== null) {
      ref.current.showModal();
    }
  }, [ref]);

  const { back } = useRouter();

  const classNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return (
    <Popover
      innerRef={ref}
      onEscapeKeyDown={back}
      onOutsideClick={back}
    >
      <Popover.Title
        onCloseClick={back}
        className='px-2 pt-2 md:px-3 md:pt-3 xl:px-4 xl:pt-4'
      />
      <Popover.Content className={classNames}>
        {isLoading ? (
          <PostCardSkeleton />
        ) : (
          <PostCard post={data?.data?.post} />
        )}
      </Popover.Content>
    </Popover>
  );
};

export default Page;
