'use server';

import { type User, Prisma } from '@prisma/client';

import { prisma } from '../db';

const readUser = async (
  options: Prisma.UserFindUniqueArgs
): Promise<User | null> => {
  let response: User | null = null;

  try {
    response = await prisma.user.findUnique(options);
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

export { readUser };
