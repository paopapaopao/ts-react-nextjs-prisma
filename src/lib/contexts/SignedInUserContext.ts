import { type Context, createContext } from 'react';
import { type User } from '@prisma/client';

type Value = { signedInUser: User | null };

export const SignedInUserContext: Context<Value | null> =
  createContext<Value | null>(null);
