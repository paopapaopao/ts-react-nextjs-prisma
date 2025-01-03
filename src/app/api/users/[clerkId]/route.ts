import { type NextRequest, NextResponse } from 'next/server';
import { type User } from '@prisma/client';

import { readUser } from '@/lib/actions';

type GETParams = {
  params: Promise<{ clerkId: string }>;
};

type GETReturn = {
  data: { user: User | null };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  _: NextRequest,
  { params }: GETParams
): Promise<NextResponse<GETReturn>> => {
  const clerkId: string = (await params).clerkId;

  const response: User | null = await readUser({
    where: { clerkId },
  });

  return NextResponse.json({
    data: { user: response },
    errors: null,
    success: true,
  });
};

export { GET };
