import { PrismaClient } from '@prisma/client';
import { type DummyJSONPost } from '@/types';

const prisma = new PrismaClient();

const getPosts = async (): Promise<DummyJSONPost[]> => {
  let posts: DummyJSONPost[] = [];

  try {
    const response: Response = await fetch('https://dummyjson.com/posts?limit=0&select=id,body,title');

    if (!response.ok) {
      throw new Error('An error occurred while getting posts.');
    }

    const data: { posts: DummyJSONPost[] } = await response.json();
    posts = data.posts;
  } catch (error) {
    console.error(error);
  }

  return posts;
};

async function main() {
  await prisma.post.deleteMany({});
  // *Resets the id to 1 
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1`);

  const initialPosts: DummyJSONPost[] = await getPosts();

  for (const post of initialPosts) {
    await prisma.post.create({
      data: {
        body: post.body,
        title: post.title
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
