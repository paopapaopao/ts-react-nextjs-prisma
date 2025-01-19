'use client';

import Form from 'next/form';
import { type ReactNode } from 'react';
import { MdSearch } from 'react-icons/md';
import { Input } from '@nextui-org/react';

const SearchField = (): ReactNode => {
  return (
    <Form action='/search'>
      <Input
        name='query'
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
        className='min-w-[344px] w-full max-w-screen-lg'
      />
    </Form>
  );
};

export default SearchField;
