'use server';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { responseWithCors } from './responseWithCors';

export const authenticateUser = async <TResponse>(
  allowedMethods: string
): Promise<
  | { userId: string; isAuthenticated: true }
  | { response: NextResponse<TResponse>; isAuthenticated: false }
> => {
  try {
    const { userId } = await auth();

    return userId === null
      ? {
          response: responseWithCors<TResponse>(
            new NextResponse(
              JSON.stringify({
                data: null,
                errors: { auth: ['User unauthenticated'] },
              }),
              {
                status: 401,
                headers: { 'Access-Control-Allow-Methods': allowedMethods },
              }
            )
          ),
          isAuthenticated: false,
        }
      : { userId, isAuthenticated: true };
  } catch (error: unknown) {
    console.error('Authenticate user error:', error);

    return {
      response: responseWithCors<TResponse>(
        new NextResponse(
          JSON.stringify({
            data: null,
            errors: { server: ['Internal server error'] },
          }),
          {
            status: 500,
            headers: { 'Access-Control-Allow-Methods': allowedMethods },
          }
        )
      ),
      isAuthenticated: false,
    };
  }
};
