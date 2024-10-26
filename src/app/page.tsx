import clsx from 'clsx';
import { type Post } from '@prisma/client';
import { readPosts } from '@/actions';
import { PostCard, PostForm } from '@/components';

const Page = async (): Promise<JSX.Element> => {
  const posts: Post[] = await readPosts({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const classNames: string = clsx(
    'home-page',
    'p-8 flex flex-col items-center gap-4'
  );

  return (
    <main className={classNames}>
      <PostForm />
      <ul className='p-8 flex flex-col items-center gap-4'>
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              isLink
            />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;
