'use client';

import { type ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

const Provider = ({ children }: Props): ReactNode => {
  return (
    <NextUIProvider>
      <ClerkProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ClerkProvider>
    </NextUIProvider>
  );
};

export default Provider;
