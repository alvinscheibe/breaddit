import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'You must be logged in to do that',
      description: 'You must be logged in to do that',
      variant: 'destructive',
      action: (
        <Link href={'/sign-in'} onClick={() => dismiss()} className={buttonVariants({ variant: 'outline' })}>Login</Link>
      )
    });
  };

  return {
    loginToast
  }
};