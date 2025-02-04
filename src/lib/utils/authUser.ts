'use server';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import type { TPost } from '../types';

const authUser = async (): Promise<
  { userId: string } | NextResponse<TPost>
> => {
  try {
    const { userId } = await auth();

    if (userId === null) {
      return NextResponse.json(
        {
          data: null,
          errors: { auth: ['User unauthenticated/unauthorized'] },
        },
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
      },
      { status: 401 }
    );
  }
};

export default authUser;
