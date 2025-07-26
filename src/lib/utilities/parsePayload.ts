'use server';

import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType, type ZodSchema } from 'zod';

import { responseWithCors } from './responseWithCors';

export const parsePayload = async <TSchema, TResponse>(
  request: NextRequest,
  schema: ZodSchema<TSchema>,
  allowedMethods: string
): Promise<
  | { parsedPayload: SafeParseReturnType<TSchema, TSchema> }
  | NextResponse<TResponse>
> => {
  try {
    const payload: TSchema = await request.json();
    const parsedPayload = schema.safeParse(payload);

    if (!parsedPayload.success) {
      return responseWithCors<TResponse>(
        new NextResponse(
          JSON.stringify({
            data: null,
            errors: parsedPayload.error?.flatten().fieldErrors,
          }),
          {
            status: 400,
            headers: { 'Access-Control-Allow-Methods': allowedMethods },
          }
        )
      );
    }

    return { parsedPayload };
  } catch (error: unknown) {
    console.error('Payload parse error:', error);

    return responseWithCors<TResponse>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { server: ['Internal server error'] },
        }),
        {
          status: 500,
          headers: { 'Access-Control-Allow-Methods': allowedMethods },
        }
      )
    );
  }
};
