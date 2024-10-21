import { type Post } from '@prisma/client';
import { createPost, readPosts } from '@/apis';
import { PostCard, PostForm } from '@/components';

const Page = async (): Promise<JSX.Element> => {
  const posts: Post[] = await readPosts({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const createPostAction = async (formData: FormData): Promise<void> => {
    'use server';

    const title = formData.get('title');
    const body = formData.get('body');

    const data = {
      title: String(title),
      body: String(body),
    };

    await createPost(data);
  };

  return (
    <main>
      <PostForm action={createPostAction} />
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
