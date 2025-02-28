import { type Params } from 'next/dist/server/request/params';
import { type ReadonlyURLSearchParams } from 'next/navigation';

import { QueryKey } from '../enums';

const getPostQueryKey = (
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  params: Params
): string[] | (QueryKey | number)[] => {
  const query = searchParams.get('query');

  if (pathname === '/search' && query !== null) {
    return [QueryKey.POSTS, query];
  }

  if (pathname.startsWith('/posts/') && params.id !== undefined) {
    return [QueryKey.POSTS, Number(params.id)];
  }

  return [QueryKey.POSTS];
};

export default getPostQueryKey;
