import { NextResponse } from 'next/server';
import {
  type Comment,
  type Post,
  type Reaction,
  type User,
  UserRole,
} from '@prisma/client';

import { responseWithCors } from './responseWithCors';

export const authorizeUser = <TResponse>(
  user: User | null,
  record: Comment | Post | Reaction | null,
  allowedMethods: string
):
  | { isAuthorized: true }
  | { response: NextResponse<TResponse>; isAuthorized: false } => {
  const isAnAdmin = user?.role === UserRole.ADMIN;
  const isAUser = user?.role === UserRole.USER;

  return isAnAdmin || (isAUser && user?.clerkId === record?.clerkUserId)
    ? { isAuthorized: true }
    : {
        response: responseWithCors<TResponse>(
          new NextResponse(
            JSON.stringify({
              data: null,
              errors: { auth: ['User unauthorized'] },
            }),
            {
              status: 403,
              headers: { 'Access-Control-Allow-Methods': allowedMethods },
            }
          )
        ),
        isAuthorized: false,
      };
};
