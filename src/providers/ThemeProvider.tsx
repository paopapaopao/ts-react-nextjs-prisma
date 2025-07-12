'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ComponentProps, type JSX } from 'react';

export const ThemeProvider = ({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>): JSX.Element => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
