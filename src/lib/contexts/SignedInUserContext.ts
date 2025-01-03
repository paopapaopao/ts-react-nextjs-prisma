import { type Context, createContext } from 'react';
import { type User } from '@prisma/client';

type Value = { signedInUser: User | null };

const SignedInUserContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default SignedInUserContext;
