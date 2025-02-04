'use server';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const authUser = async <T>(): Promise<{ userId: string } | NextResponse<T>> => {
  try {
    const { userId } = await auth();

    if (userId === null) {
      return NextResponse.json(
        {
          data: null,
          errors: { auth: ['User unauthenticated/unauthorized'] },
        } as T,
        { status: 401 }
      );
    }

    return { userId };
  } catch (error: unknown) {
    console.error('User auth error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { auth: ['User auth failed'] },
      } as T,
      { status: 401 }
    );
  }
};

export default authUser;
