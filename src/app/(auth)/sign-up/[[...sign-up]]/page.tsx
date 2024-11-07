import { type ReactNode } from 'react';
import { SignUp } from '@clerk/nextjs';

const Page = (): ReactNode => {
  return (
    <main className='p-8 flex justify-center items-center'>
      <SignUp />
    </main>
  );
};

export default Page;
