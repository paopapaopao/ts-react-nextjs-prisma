import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import type { UserQuery } from '@/lib/types';
import { authenticateUser } from '@/lib/utils';

type Params = {
  params: Promise<{ clerkId: string }>;
};

const GET = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<UserQuery>> => {
  const authenticateUserResult = await authenticateUser<UserQuery>();

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  try {
    const clerkId = (await params).clerkId;

    const response = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (response === null) {
      return NextResponse.json(
        {
          data: { user: null },
          errors: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: { user: response },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('User find unique error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { database: ['User find unique failed'] },
      },
      { status: 500 }
    );
  }
};

export { GET };
