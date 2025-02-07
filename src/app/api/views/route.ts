import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type View } from '@prisma/client';

import { prisma } from '@/lib/db';
import { viewSchema } from '@/lib/schemas';
import type { TViewMutation, ViewSchema } from '@/lib/types';
import { authenticateUser, parsePayload } from '@/lib/utils';

const POST = async (
  request: NextRequest
): Promise<NextResponse<TViewMutation>> => {
  const authUserResult = await authenticateUser<TViewMutation>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  const parsePayloadResult = await parsePayload<ViewSchema, TViewMutation>(
    request,
    viewSchema
  );

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const response: View | null = await prisma.view.create({
      data: parsedPayload.data as ViewSchema,
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.postId}`);

    return NextResponse.json(
      {
        data: { view: response },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('View create error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { database: ['View create failed'] },
      },
      { status: 500 }
    );
  }
};

export { POST };
