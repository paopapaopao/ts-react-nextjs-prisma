import clsx from 'clsx';
import { PostCard } from '@/components';
import { readPostWithUserAndCommentsCount } from '@/lib/actions';
import { type PostWithUserAndCommentsCount } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props): Promise<JSX.Element> => {
  const id: string = (await params).id;
  const post: PostWithUserAndCommentsCount =
    await readPostWithUserAndCommentsCount(Number(id));

  const classNames: string = clsx(
    'p-2 flex flex-col items-center',
    'md:p-5',
    'xl:p-8'
  );

  return (
    <main className={classNames}>
      <PostCard
        post={post}
        className='min-w-[344px] w-full max-w-screen-xl'
      />
    </main>
  );
};

export default Page;
