import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType, type ZodSchema } from 'zod';

import { responseWithCors } from './responseWithCors';

export const parsePayload = async <TSchema, TResponse>(
  request: NextRequest,
  schema: ZodSchema<TSchema>,
  allowedMethods: string
): Promise<
  | { parsedPayload: SafeParseReturnType<TSchema, TSchema>; isParsed: true }
  | { response: NextResponse<TResponse>; isParsed: false }
> => {
  try {
    const payload: TSchema = await request.json();
    const parsedPayload = schema.safeParse(payload);

    return parsedPayload.success
      ? { parsedPayload, isParsed: true }
      : {
          response: responseWithCors<TResponse>(
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
          ),
          isParsed: false,
        };
  } catch (error: unknown) {
    console.error('Parse payload error:', error);

    return {
      response: responseWithCors<TResponse>(
        new NextResponse(
          JSON.stringify({
            data: null,
            errors: { server: ['Parse payload failed'] },
          }),
          {
            status: 500,
            headers: { 'Access-Control-Allow-Methods': allowedMethods },
          }
        )
      ),
      isParsed: false,
    };
  }
};
