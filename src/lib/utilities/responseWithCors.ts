import { NextResponse } from 'next/server';

const responseWithCors = <TData>(
  response: NextResponse<TData>
): NextResponse<TData> => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Content-Type', 'application/json');

  return response;
};

export default responseWithCors;
