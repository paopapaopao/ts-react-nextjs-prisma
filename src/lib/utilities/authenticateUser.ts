'use server';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import responseWithCors from './responseWithCors';

const authenticateUser = async <TResponse>(
  allowedMedthods: string
): Promise<{ userId: string } | NextResponse<TResponse>> => {
  try {
    const { userId } = await auth();

    if (userId === null) {
      return responseWithCors<TResponse>(
        new NextResponse(
          JSON.stringify({
            data: null,
            errors: { auth: ['User unauthenticated'] },
          } as TResponse),
          {
            status: 401,
            headers: {
              'Access-Control-Allow-Methods': allowedMedthods,
            },
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
          errors: { auth: ['User authentication failed'] },
        } as TResponse),
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Methods': allowedMedthods,
          },
        }
      )
    );
  }
};

export default authenticateUser;
