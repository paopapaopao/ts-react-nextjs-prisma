import { type NextRequest, NextResponse } from 'next/server';
import { type Post } from '@prisma/client';
import { readPost } from '@/actions';
import { prisma } from '@/lib/db';

/**
 * TODOs
 * - create return type
 */

const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<
  NextResponse<{
    data: Post | null;
    errors: { [key: string]: string[] } | null;
    success: boolean;
  }>
> => {
  const post: Post | null = await readPost({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({
    data: post,
    errors: null,
    success: true,
  });
};

export { GET };
