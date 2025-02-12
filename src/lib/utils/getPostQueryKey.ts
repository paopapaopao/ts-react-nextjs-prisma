import { type Params } from 'next/dist/server/request/params';
import { type ReadonlyURLSearchParams } from 'next/navigation';

import { QueryKey } from '../enums';

const getPostQueryKey = (
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  params: Params
): (string | number)[] => {
  const query = searchParams.get('query');

  let queryKey: (string | number)[] = [QueryKey.POSTS];

  if (pathname === '/search' && query !== null) {
    queryKey = [QueryKey.POSTS, query];
  }

  if (pathname.startsWith('/posts/') && params.id !== undefined) {
    queryKey = [QueryKey.POSTS, Number(params.id)];
  }

  return queryKey;
};

export default getPostQueryKey;
