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
  model: Comment | Post | Reaction | null,
  allowedMethods: string
): NextResponse<TResponse> | null => {
  const isAnAdmin = user?.role === UserRole.ADMIN;
  const isAUser = user?.role === UserRole.USER;

  if (!(isAnAdmin || (isAUser && user?.clerkId === model?.clerkUserId))) {
    return responseWithCors<TResponse>(
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
    );
  }

  return null;
};
