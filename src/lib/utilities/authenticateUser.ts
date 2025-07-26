'use server';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { responseWithCors } from './responseWithCors';

export const authenticateUser = async <TResponse>(
  allowedMethods: string
): Promise<{ userId: string } | NextResponse<TResponse>> => {
  try {
    const { userId } = await auth();

    if (userId === null) {
      return responseWithCors<TResponse>(
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
      );
    }

    return { userId };
  } catch (error: unknown) {
    console.error('User authentication error:', error);

    return responseWithCors<TResponse>(
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
    );
  }
};
