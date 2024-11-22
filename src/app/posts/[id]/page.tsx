import clsx from 'clsx';
import { redirect } from 'next/navigation';
import { type Post } from '@prisma/client';
import { deletePost, readPost } from '@/lib/actions';
import { Button, PostCard, PostForm } from '@/components';

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props): Promise<JSX.Element> => {
  const id: string = (await params).id;

  const post: Post | null = await readPost({
    where: { id: Number(id) },
  });

  const deletePostAction = async (): Promise<void> => {
    'use server';

    await deletePost(Number(id));
    redirect('/');
  };

  const classNames: string = clsx(
    'p-2 flex flex-col items-center gap-4',
    'md:p-5 md:gap-6',
    'xl:p-8 xl:gap-8'
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
