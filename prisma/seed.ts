import { PrismaClient } from '@prisma/client';
import {
  type DummyJSONComment,
  type DummyJSONPost,
  type DummyJSONUser,
} from '@/lib/types';

const prisma = new PrismaClient();

const getUsers = async (): Promise<DummyJSONUser[]> => {
  let users: DummyJSONUser[] = [];

  try {
    const response: Response = await fetch(
      'https://dummyjson.com/users?limit=0&select=id,firstName,image,lastName'
    );

    if (!response.ok) {
      throw new Error('An error occurred while getting users.');
    }

    const data: { users: DummyJSONUser[] } = await response.json();
    users = data.users;
  } catch (error) {
    console.error(error);
  }

  return users;
};

const getPosts = async (): Promise<DummyJSONPost[]> => {
  let posts: DummyJSONPost[] = [];

  try {
    const response: Response = await fetch(
      'https://dummyjson.com/posts?limit=0&select=id,body,title,userId'
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
      'https://dummyjson.com/comments?limit=0&select=id,body,postId,user'
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
  await prisma.user.deleteMany({});
  // *Resets the id to 1
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`);

  const initialUsers: DummyJSONUser[] = await getUsers();
  const initialPosts: DummyJSONPost[] = await getPosts();
  const initialComments: DummyJSONComment[] = await getComments();

  for (const user of initialUsers) {
    await prisma.user.create({
      data: {
        firstName: user.firstName,
        image: user.image,
        lastName: user.lastName,
      },
    });
  }

  for (const post of initialPosts) {
    await prisma.post.create({
      data: {
        body: post.body,
        title: post.title,
        userId: post.userId,
      },
    });
  }

  for (const comment of initialComments) {
    await prisma.comment.create({
      data: {
        body: comment.body,
        postId: comment.postId,
        userId: comment.user.id,
      },
    });
  }

  // *NOTE - Special user
  await prisma.user.create({
    data: {
      clerkId: 'user_2p4DitF4CYMmZWgWRGvJy1dXMWd',
      firstName: 'Juan',
      lastName: 'de la Cruz',
    },
  });
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
