'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      signIn('google');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error while logging in. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button onClick={loginWithGoogle} isLoading={isLoading} size={'sm'} className={'w-full'}>
        {isLoading ? null : <Icons.google className={'h-4 w-4 mr-2'} />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;