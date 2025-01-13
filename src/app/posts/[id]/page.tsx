'use client';

import clsx from 'clsx';
import { type ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PostCard, PostCardSkeleton } from '@/components';
import { QueryKey } from '@/lib/enums';
import { useCreateView, useSignedInUser } from '@/lib/hooks';

type Props = {
  params: { id: string };
};

const Page = ({ params: { id } }: Props): ReactNode => {
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
