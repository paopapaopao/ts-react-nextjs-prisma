import { type ReactNode } from 'react';
import { SignIn } from '@clerk/nextjs';

const Page = (): ReactNode => {
  return (
    <main className='p-8 flex justify-center items-center'>
      <SignIn />
    </main>
  );
};

export default Page;
