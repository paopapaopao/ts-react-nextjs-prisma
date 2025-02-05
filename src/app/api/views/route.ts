import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type View } from '@prisma/client';

import { prisma } from '@/lib/db';
import { viewSchema } from '@/lib/schemas';
import { type ViewSchema } from '@/lib/types';
import { authUser, parsePayload } from '@/lib/utils';

type Return = {
  data: { view: View | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
};

const POST = async (request: NextRequest): Promise<NextResponse<Return>> => {
  const authUserResult = await authUser<Return>();

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

    return NextResponse.json({
      data: { view: response },
      errors: null,
    });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json({
      data: null,
      errors: error,
    });
  }
};

export { POST };
