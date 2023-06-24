import Link from 'next/link';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import UserAccountNav from '@/components/user-account-nav';
import SearchBar from '@/components/search-bar';
import { Github } from 'lucide-react';

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className={'fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'}>
      <div className={'container max-w-7xl h-full mx-auto flex items-center justify-between pag-2'}>
        <Link href={'/'} className={'flex gap-2 items-center'}>
          <Icons.logo className={'h-8 w-8 sm:h-6 sm:w-6'} />
          <p className={'hidden text-zinc-700 text-sm font-medium md:block'}>Breaddit</p>
        </Link>

        <SearchBar />

        <div className={'flex items-center justify-between'}>
          <a href={'https://github.com/alvinscheibe/breaddit'} target={'_blank'}>
            <Github className={'h-8 w-8 sm:h-6 sm:w-6 text-zinc-700 hidden md:block mr-2'} />
          </a>

          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : <Link href={'/sign-in'} className={buttonVariants()}>Sign In</Link>}
        </div>
      </div>
    </div>
  );
}

export default Navbar;