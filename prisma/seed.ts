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
      'https://dummyjson.com/users?limit=0&select=id,firstName,lastName,image'
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
      'https://dummyjson.com/posts?limit=0&select=id,title,body,userId,reactions'
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
      'https://dummyjson.com/comments?limit=0&select=id,body,user,postId,likes'
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
  await prisma.reaction.deleteMany({});
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
  const initialPostReactions: { likes: number; dislikes: number }[] = [];
  const initialCommentReactions: number[] = [];

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

    initialPostReactions.push({
      likes: Math.floor((post.reactions.likes % initialUsers.length) / 2),
      dislikes: Math.floor((post.reactions.dislikes % initialUsers.length) / 2),
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

    initialCommentReactions.push(comment.likes);
  }

  // *NOTE - Special user
  await prisma.user.create({
    data: {
      clerkId: 'user_2p4DitF4CYMmZWgWRGvJy1dXMWd',
      firstName: 'Juan',
      lastName: 'de la Cruz',
    },
  });

  for (let index = 0; index < initialPostReactions.length; index++) {
    let userId = 1;

    for (let i = 0; i < initialPostReactions[index].likes % 10; i++) {
      await prisma.reaction.create({
        data: {
          type: 'LIKE',
          userId,
          postId: index + 1,
        },
      });

      userId++;
    }

    for (let i = 0; i < initialPostReactions[index].dislikes % 10; i++) {
      await prisma.reaction.create({
        data: {
          type: 'DISLIKE',
          userId,
          postId: index + 1,
        },
      });

      userId++;
    }
  }

  for (let index = 0; index < initialCommentReactions.length; index++) {
    let userId = 1;

    for (let i = 0; i < initialCommentReactions[index] % 10; i++) {
      await prisma.reaction.create({
        data: {
          type: 'LIKE',
          userId,
          commentId: index + 1,
        },
      });

      userId++;
    }
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
