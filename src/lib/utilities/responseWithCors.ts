import { type NextResponse } from 'next/server';

export const responseWithCors = <TResponse>(
  response: NextResponse<TResponse>
): NextResponse<TResponse> => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Content-Type', 'application/json');

  return response;
};
