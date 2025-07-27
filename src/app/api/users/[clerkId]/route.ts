import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/database';
import { HttpMethod } from '@/lib/enumerations';
import type { UserQuery } from '@/lib/types';
import { authenticateUser, responseWithCors } from '@/lib/utilities';

type Params = {
  params: Promise<{ clerkId: string }>;
};

const ALLOWED_METHODS = [HttpMethod.GET, HttpMethod.OPTIONS].join(', ');

export const GET = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<UserQuery>> => {
  const authenticateUserResult = await authenticateUser<UserQuery>(
    ALLOWED_METHODS
  );

  if (!authenticateUserResult.isAuthenticated) {
    return authenticateUserResult.response;
  }

  try {
    const clerkId = (await params).clerkId;

    const response = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (response === null) {
      return responseWithCors<UserQuery>(
        new NextResponse(
          JSON.stringify({
            data: { user: null },
            errors: null,
          }),
          {
            status: 404,
            headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
          }
        )
      );
    }

    return responseWithCors<UserQuery>(
      new NextResponse(
        JSON.stringify({
          data: { user: response },
          errors: null,
        }),
        {
          status: 200,
          headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
        }
      )
    );
  } catch (error: unknown) {
    console.error('User find unique error:', error);

    return responseWithCors<UserQuery>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['User find unique failed'] },
        }),
        {
          status: 500,
          headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
        }
      )
    );
  }
};

export const OPTIONS = (): NextResponse<null> => {
  return responseWithCors<null>(
    new NextResponse(null, {
      status: 204,
      headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
    })
  );
};
