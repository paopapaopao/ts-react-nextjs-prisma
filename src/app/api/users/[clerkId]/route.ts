import { type NextRequest, NextResponse } from 'next/server';
import { type User } from '@prisma/client';

import { prisma } from '@/lib/db';

type Params = {
  params: Promise<{ clerkId: string }>;
};

type Return = {
  data: { user: User | null };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<Return>> => {
  const clerkId: string = (await params).clerkId;

  const user: User | null = await prisma.user.findUnique({
    where: { clerkId },
  });

  return NextResponse.json({
    data: { user },
    errors: null,
    success: true,
  });
};

export { GET };
