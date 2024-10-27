'use client';

import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { type ChangeEvent, type ReactNode } from 'react';

const SearchPostField = (): ReactNode => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const pathname: string = usePathname();
  const { replace } = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const params: URLSearchParams = new URLSearchParams(searchParams);

    if (event.target.value !== '') {
      params.set('query', event.target.value);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <input
      defaultValue={searchParams.get('query')?.toString()}
      onChange={handleChange}
      type='text'
    />
  );
};

export default SearchPostField;
