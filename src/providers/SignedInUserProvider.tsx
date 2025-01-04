import { type ReactNode, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { type User } from '@prisma/client';

import { SignedInUserContext } from '@/lib/contexts';

type Props = { children: ReactNode };

const SignedInUserProvider = ({ children }: Props): ReactNode => {
  const { user } = useUser();

  const [signedInUser, setSignedInUser] = useState<User | null>(null);

  useEffect((): void => {
    if (user?.id) {
      // TODO
      const getUser = async () => {
        const response = await fetch(`/api/users/${user?.id}`);
        const data = await response.json();

        setSignedInUser(data.data.user);
      };

      getUser();
    }
  }, [user?.id]);

  return (
    <SignedInUserContext.Provider value={{ signedInUser }}>
      {children}
    </SignedInUserContext.Provider>
  );
};

export default SignedInUserProvider;
