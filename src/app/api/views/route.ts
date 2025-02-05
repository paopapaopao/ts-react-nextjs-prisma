import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type View } from '@prisma/client';

import { prisma } from '@/lib/db';
import { viewSchema } from '@/lib/schemas';
import type { TView, ViewSchema } from '@/lib/types';
import { authUser, parsePayload } from '@/lib/utils';

const POST = async (request: NextRequest): Promise<NextResponse<TView>> => {
  const authUserResult = await authUser<TView>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  const parsePayloadResult = await parsePayload<ViewSchema>(
    request,
    viewSchema
  );

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const response: View | null = await prisma.view.create({
      data: parsedPayload.data,
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
