'use client';

import { type ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SignedInUserProvider } from './SignedInUserProvider';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

export const Provider = ({ children }: Props): ReactNode => {
  return (
    <ClerkProvider>
      <SignedInUserProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SignedInUserProvider>
    </ClerkProvider>
  );
};
