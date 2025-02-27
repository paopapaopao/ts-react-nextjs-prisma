import Form from 'next/form';
import { type ReactNode } from 'react';

import { Input } from '../ui';

const SearchForm = (): ReactNode => {
  return (
    <Form action='/search'>
      <Input
        name='query'
        placeholder='Search posts'
        className='min-w-[344px] w-full max-w-screen-lg'
      />
    </Form>
  );
};

export default SearchForm;
