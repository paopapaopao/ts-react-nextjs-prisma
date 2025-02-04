import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type View } from '@prisma/client';

import { prisma } from '@/lib/db';
import { viewSchema } from '@/lib/schemas';
import { type ViewSchema } from '@/lib/types';

type Return = {
  data: { view: View | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
};

const POST = async (request: NextRequest): Promise<NextResponse<Return>> => {
  const payload: ViewSchema = await request.json();

  const parsedPayload: SafeParseReturnType<ViewSchema, ViewSchema> =
    viewSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
    });
  }

  try {
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
