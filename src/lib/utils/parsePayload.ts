import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType, type ZodSchema } from 'zod';

const parsePayload = async <TSchema, TResponse>(
  request: NextRequest,
  schema: ZodSchema<TSchema>
): Promise<
  | { parsedPayload: SafeParseReturnType<TSchema, TSchema> }
  | NextResponse<TResponse>
> => {
  try {
    const payload: TSchema = await request.json();
    const parsedPayload = schema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          data: null,
          errors: parsedPayload.error?.flatten().fieldErrors,
        } as TResponse,
        { status: 400 }
      );
    }

    return { parsedPayload };
  } catch (error: unknown) {
    console.error('Payload parse error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { server: ['Internal server error'] },
      } as TResponse,
      { status: 500 }
    );
  }
};

export default parsePayload;
