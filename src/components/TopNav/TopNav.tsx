import Link from 'next/link';
import { type ReactNode } from 'react';
import { MdHome, MdLogin } from 'react-icons/md';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

import { NavigationMenu, NavigationMenuItem } from '../ui';

const TopNav = (): ReactNode => {
  return (
    <div className='p-2 md:p-3 xl:p-4 flex justify-center sticky top-0 bg-white border-b'>
      <NavigationMenu className='flex-1 max-w-screen-xl flex justify-between'>
        <NavigationMenuItem className='list-none'>
          <Link
            href='/'
            className='flex items-center gap-2'
          >
            <MdHome size={32} />
            Home
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem className='list-none'>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className='flex items-center gap-2'>
              <MdLogin size={32} />
              <SignInButton mode='modal' />
            </div>
          </SignedOut>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
  );
};

export default TopNav;
