import { PrismaClient } from '@prisma/client';
import { type DummyJSONComment, type DummyJSONPost } from '@/lib/types';

const prisma = new PrismaClient();

const getPosts = async (): Promise<DummyJSONPost[]> => {
  let posts: DummyJSONPost[] = [];

  try {
    const response: Response = await fetch(
      'https://dummyjson.com/posts?limit=0&select=id,body,title'
    );

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

const getComments = async (): Promise<DummyJSONComment[]> => {
  let comments: DummyJSONComment[] = [];

  try {
    const response: Response = await fetch(
      'https://dummyjson.com/comments?limit=0&select=id,body,postId'
    );

    if (!response.ok) {
      throw new Error('An error occurred while getting comments.');
    }

    const data: { comments: DummyJSONComment[] } = await response.json();
    comments = data.comments;
  } catch (error) {
    console.error(error);
  }

  return comments;
};

async function main() {
  await prisma.comment.deleteMany({});
  // *Resets the id to 1
  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1`
  );
  await prisma.post.deleteMany({});
  // *Resets the id to 1
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1`);

  const initialPosts: DummyJSONPost[] = await getPosts();
  const initialComments: DummyJSONComment[] = await getComments();

  for (const post of initialPosts) {
    await prisma.post.create({
      data: {
        body: post.body,
        title: post.title,
      },
    });
  }

  for (const comment of initialComments) {
    await prisma.comment.create({
      data: {
        body: comment.body,
        postId: comment.postId,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
