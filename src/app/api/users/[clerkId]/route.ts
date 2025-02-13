import { type NextRequest, NextResponse } from 'next/server';
import { type User } from '@prisma/client';

import { prisma } from '@/lib/db';
import type { UserQuery } from '@/lib/types';

type Params = {
  params: Promise<{ clerkId: string }>;
};

const GET = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<UserQuery>> => {
  const clerkId: string = (await params).clerkId;

  const response: User | null = await prisma.user.findUnique({
    where: { clerkId },
  });

  return NextResponse.json({
    data: { user: response },
    errors: null,
  });
};

export { GET };
