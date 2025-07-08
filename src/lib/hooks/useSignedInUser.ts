'use client';

import { useContext } from 'react';
import { type User } from '@prisma/client';

import { SignedInUserContext } from '../contexts';

type Value = { signedInUser: User | null };

export const useSignedInUser = (): Value => {
  // TODO
  const context = useContext(SignedInUserContext);

  if (context === null) {
    throw new Error(
      'useSignedInUser must be used within SignedInUserContext.Provider'
    );
  }

  return context;
};
