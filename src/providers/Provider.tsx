'use client';

import { type ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import SignedInUserProvider from './SignedInUserProvider';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

const Provider = ({ children }: Props): ReactNode => {
  return (
    <NextUIProvider>
      <ClerkProvider>
        <SignedInUserProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </SignedInUserProvider>
      </ClerkProvider>
    </NextUIProvider>
  );
};

export default Provider;
