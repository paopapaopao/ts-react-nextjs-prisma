'use client';

import {
  type ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react';
import { MdSearch } from 'react-icons/md';
import { Input } from '@nextui-org/react';

const SearchField = (): ReactNode => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const params: URLSearchParams = new URLSearchParams(searchParams);
  const { push } = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value !== '') {
      params.set('query', event.target.value);
    } else {
      params.delete('query');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      push(`/search?${params.toString()}`);
    }
  };

  return (
    <Input
      defaultValue={searchParams.get('query')?.toString()}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      startContent={
        <MdSearch
          className='text-black'
          size={32}
        />
      }
      placeholder='Search posts'
      size='lg'
      radius='sm'
      variant='faded'
    />
  );
};

export default SearchField;
