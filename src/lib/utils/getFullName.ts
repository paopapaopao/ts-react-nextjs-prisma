import { type User } from '@prisma/client';

const getFullName = (user: User): string => {
  return user.firstName + user.lastName;
};

export default getFullName;
