import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { viewSchema } from '@/lib/schemas';
import type { ViewMutation, ViewSchema } from '@/lib/types';
import { authenticateUser, parsePayload } from '@/lib/utilities';

const POST = async (
  request: NextRequest
): Promise<NextResponse<ViewMutation>> => {
  const authenticateUserResult = await authenticateUser<ViewMutation>();

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  const parsePayloadResult = await parsePayload<ViewSchema, ViewMutation>(
    request,
    viewSchema
  );

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const response = await prisma.view.create({
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
