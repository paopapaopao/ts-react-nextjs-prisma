import clsx from 'clsx';
import { redirect } from 'next/navigation';
import { type Post } from '@prisma/client';
import { deletePost, readPost } from '@/actions';
import { Button, PostCard, PostForm } from '@/components';

interface Props {
  params: {
    id: string;
  };
}

const Page = async ({ params: { id } }: Props): Promise<JSX.Element> => {
  const post: Post | null = await readPost({
    where: {
      id: Number(id),
    },
  });

  const deletePostAction = async (): Promise<void> => {
    'use server';

    await deletePost(Number(id));
    redirect('/');
  };

  const classNames: string = clsx(
    'post-details-page',
    'p-8 flex flex-col items-center gap-4'
  );

  return (
    <main className={classNames}>
      <PostForm post={post} />
      <h1 className='text-xl font-bold'>Post {id}</h1>
      <PostCard post={post} />
      <form action={deletePostAction}>
        <Button>Delete post</Button>
      </form>
    </main>
  );
};

export default Page;
