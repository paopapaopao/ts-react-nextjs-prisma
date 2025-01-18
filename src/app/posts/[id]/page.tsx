'use client';

import clsx from 'clsx';
import { type ReactNode, use, useEffect } from 'react';

import { PostCard, PostCardSkeleton } from '@/components';
import { useCreateView, useReadPost, useSignedInUser } from '@/lib/hooks';

type Props = {
  params: Promise<{ id: string }>;
};

const Page = (props: Props): ReactNode => {
  const params = use(props.params);
  const { id } = params;

  const { data, isLoading } = useReadPost(id);

  const { signedInUser } = useSignedInUser();

  const { mutate: createView } = useCreateView();

  useEffect((): void => {
    if (signedInUser && signedInUser.id && id) {
      createView({
        userId: signedInUser.id,
        postId: Number(id),
      });
    }
  }, [signedInUser, id, createView]);

  const classNames: string = clsx(
    'p-2 flex flex-col items-center',
    'md:p-5',
    'xl:p-8'
  );

  return (
    <main className={classNames}>
      {isLoading ? (
        <PostCardSkeleton className='min-w-[344px] w-full max-w-screen-xl' />
      ) : (
        <PostCard
          post={data?.data?.post}
          className='min-w-[344px] w-full max-w-screen-xl'
        />
      )}
    </main>
  );
};

export default Page;
