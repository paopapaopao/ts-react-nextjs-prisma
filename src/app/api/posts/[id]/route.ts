import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/database';
import { HttpMethod } from '@/lib/enumerations';
import { postSchema } from '@/lib/schemas';
import type { PostMutation, PostQuery, PostSchema } from '@/lib/types';
import {
  authenticateUser,
  parsePayload,
  responseWithCors,
} from '@/lib/utilities';

type Params = {
  params: Promise<{ id: string }>;
};

const ALLOWED_METHODS = [
  HttpMethod.GET,
  HttpMethod.PUT,
  HttpMethod.DELETE,
  HttpMethod.OPTIONS,
].join(', ');

export const GET = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<PostQuery>> => {
  const authenticateUserResult =
    await authenticateUser<PostQuery>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  try {
    const { userId } = authenticateUserResult;

    const id = Number((await params).id);

    const response = await prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        originalPost: {
          include: { user: true },
        },
        _count: {
          select: {
            shares: true,
            comments: {
              where: { parentCommentId: null },
            },
            reactions: true,
            views: true,
          },
        },
        reactions: {
          where: { clerkUserId: userId },
        },
      },
    });

    if (response === null) {
      return responseWithCors<PostQuery>(
        new NextResponse(
          JSON.stringify({
            data: { post: null },
            errors: null,
          }),
          {
            status: 404,
            headers: {
              'Access-Control-Allow-Methods': ALLOWED_METHODS,
            },
          }
        )
      );
    }

    const { reactions, ...responseWithoutReactions } = response;
    const userReaction = reactions[0] ?? null;

    return responseWithCors<PostQuery>(
      new NextResponse(
        JSON.stringify({
          data: {
            post: { ...responseWithoutReactions, userReaction },
          },
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
    console.error('Post find unique error:', error);

    return responseWithCors<PostQuery>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Post find unique failed'] },
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

export const PUT = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<PostMutation>> => {
  const authenticateUserResult =
    await authenticateUser<PostMutation>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  const parsePayloadResult = await parsePayload<PostSchema, PostMutation>(
    request,
    postSchema,
    ALLOWED_METHODS
  );

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const id = Number((await params).id);

    const response = await prisma.post.update({
      where: { id },
      data: parsedPayload.data as PostSchema,
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.id}`);

    return responseWithCors<PostMutation>(
      new NextResponse(
        JSON.stringify({
          data: { post: response },
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
    console.error('Post update error:', error);

    return responseWithCors<PostMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Post update failed'] },
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

export const DELETE = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<PostMutation>> => {
  const authenticateUserResult =
    await authenticateUser<PostMutation>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  try {
    const id = Number((await params).id);

    const response = await prisma.post.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.id}`);

    return responseWithCors<PostMutation>(
      new NextResponse(
        JSON.stringify({
          data: { post: response },
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
    console.error('Post delete error:', error);

    return responseWithCors<PostMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Post delete failed'] },
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
