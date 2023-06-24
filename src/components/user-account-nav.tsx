'use client';

import { User } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/user-avatar';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface UserAccountNavProps {
  user: Pick<User, 'name' | 'image' | 'email'>
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className={'h-8 w-8'}
          user={{
            name: user.name || null,
            image: user.image || null
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className={'bg-white'} align={'end'}>
        <div className={'flex items-center justify-start gap-2 p-2'}>
          <div className={'flex flex-col space-y-1 leading-none'}>
            {user.name && <p className={'font-medium'}>{user.name}</p>}
            {user.email && <p className={'w-[200px] truncate text-sm text-zinc-700'}>{user.email}</p>}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild={true}>
          <Link href={'/'}>Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild={true}>
          <Link href={'/r/create'}>Create community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild={true}>
          <Link href={'/settings'}>Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`
            });
          }}
          className={'cursor-pointer'}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;