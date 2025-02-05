import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType, type ZodSchema } from 'zod';

const parsePayload = async <T>(request: NextRequest, schema: ZodSchema<T>) => {
  try {
    const payload: T = await request.json();

    const parsedPayload: SafeParseReturnType<T, T> = schema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          data: null,
          errors: parsedPayload.error?.flatten().fieldErrors,
        },
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
      },
      { status: 500 }
    );
  }
};

export default parsePayload;
