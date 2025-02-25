'use server';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const authenticateUser = async <TResponse>(): Promise<
  { userId: string } | NextResponse<TResponse>
> => {
  try {
    const { userId } = await auth();

    if (userId === null) {
      return NextResponse.json(
        {
          data: null,
          errors: { auth: ['User unauthenticated'] },
        } as TResponse,
        { status: 401 }
      );
    }

    return { userId };
  } catch (error: unknown) {
    console.error('User authentication error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { auth: ['User authentication failed'] },
      } as TResponse,
      { status: 401 }
    );
  }
};

export default authenticateUser;
