'use server';

import { type Comment, Prisma } from '@prisma/client';
import { prisma } from '../db';

const createComment = async (
  payload: Prisma.CommentUncheckedCreateInput
): Promise<Comment | null> => {
  const args: Prisma.CommentCreateArgs = { data: payload };
  let response: Comment | null = null;

  try {
    response = await prisma.comment.create(args);
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

const readComments = async (
  options: Prisma.CommentFindManyArgs
): Promise<Comment[]> => {
  let response: Comment[] = [];

  try {
    response = await prisma.comment.findMany(options);
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

const updateComment = async (
  payload: Prisma.CommentUncheckedUpdateInput
): Promise<Comment | null> => {
  const { id, body } = payload;

  const args: Prisma.CommentUpdateArgs = {
    where: { id: Number(id) },
    data: { body },
  };

  let response: Comment | null = null;

  try {
    response = await prisma.comment.update(args);
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

const deleteComment = async (id: number): Promise<Comment | null> => {
  const args: Prisma.CommentDeleteArgs = {
    where: { id },
  };

  let response: Comment | null = null;

  try {
    response = await prisma.comment.delete(args);
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

export { createComment, deleteComment, readComments, updateComment };
