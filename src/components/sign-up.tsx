import { Icons } from '@/components/icons';
import Link from 'next/link';
import UserAuthForm from '@/components/user-auth-form';

const SignUp = () => {
  return (
    <div className={'container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'}>
      <div className={'flex flex-col space-y-2 text-center'}>
        <Icons.logo className={'mx-auto h-6 w-6'} />
        <h1 className={'text-2xl font-semibold tracking-tighter'}>
          Sign Up
        </h1>
        <p className={'text-sm max-w-xs max-auto'}>
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>

        <UserAuthForm />

        <p className={'px-8 text-center text-sm text-zinc-700'}>
          Already a Breadditor?{' '}
          <Link href={'/sign-in'} className={'hover:text-zinc-800 underline underline-offset-4'}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;