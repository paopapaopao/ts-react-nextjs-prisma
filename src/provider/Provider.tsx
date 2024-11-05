'use client';

import { type ReactNode } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Provider = ({ children }: Props): ReactNode => {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextUIProvider>
  );
};

export default Provider;
