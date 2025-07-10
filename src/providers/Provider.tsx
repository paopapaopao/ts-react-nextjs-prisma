'use client';

import { type JSX, type ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SignedInUserProvider } from './SignedInUserProvider';
import { ThemeProvider } from './ThemeProvider';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

export const Provider = ({ children }: Props): JSX.Element => {
  return (
    <ThemeProvider>
      <ClerkProvider>
        <SignedInUserProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </SignedInUserProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
};
