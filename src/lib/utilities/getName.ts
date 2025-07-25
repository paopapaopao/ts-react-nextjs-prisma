import { type User } from '@prisma/client';

export const getName = (user: User | undefined): string => {
  return user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : `${user?.username}`;
};
