import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { HttpMethod } from '@/lib/enumerations';
import { viewSchema } from '@/lib/schemas';
import type { ViewMutation, ViewSchema } from '@/lib/types';
import {
  authenticateUser,
  parsePayload,
  responseWithCors,
} from '@/lib/utilities';

const ALLOWED_METHODS = [HttpMethods.POST, HttpMethods.OPTIONS].join(', ');

export const POST = async (
  request: NextRequest
): Promise<NextResponse<ViewMutation>> => {
  const authenticateUserResult =
    await authenticateUser<ViewMutation>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  const parsePayloadResult = await parsePayload<ViewSchema, ViewMutation>(
    request,
    viewSchema,
    ALLOWED_METHODS
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

    return responseWithCors<ViewMutation>(
      new NextResponse(
        JSON.stringify({
          data: { view: response },
          errors: null,
        }),
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Methods': ALLOWED_METHODS,
          },
        }
      )
    );
  } catch (error: unknown) {
    console.error('View create error:', error);

    return responseWithCors<ViewMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['View create failed'] },
        }),
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Methods': ALLOWED_METHODS,
          },
        }
      )
    );
  }
};

export const OPTIONS = (): NextResponse<null> => {
  return responseWithCors<null>(
    new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': ALLOWED_METHODS,
      },
    })
  );
};
