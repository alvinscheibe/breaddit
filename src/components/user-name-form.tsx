'use client';

import { useForm } from 'react-hook-form';
import { UsernameRequest, UsernameSchema } from '@/lib/validators/username';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface UserNameFormProps {
  user: Pick<User, 'id' | 'username'>
}

const UserNameForm = ({ user }: UserNameFormProps) => {
  const { handleSubmit, register, formState: { errors } } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      name: user?.username || ''
    }
  });
  const router = useRouter();

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = {
        name
      };
      const { data } = await axios.patch('/api/username', payload);

      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409)
          return toast({
            title: 'Username already exists',
            description: 'A username with that name already exists. Please try another name.',
            variant: 'destructive'
          });
      }

      return toast({
        title: 'An error occurred',
        description: 'An unknown error occurred while changing your username. Please try again later.',
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      toast({
        title: 'Username changed',
        description: 'Your username has been changed.',
      });
      router.refresh();
    }
  });

  return (
    <form onSubmit={handleSubmit((event) => updateUsername(event))}>
      <Card>
        <CardHeader>
          <CardTitle>
            Username
          </CardTitle>
          <CardDescription>
            Please enter a username for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={'relative grid gap-1'}>
            <div className={'absolute top-0 left-0 w-8 h-10 grid place-items-center'}>
              <span className={'text-sm text-zinc-400'}>
                u/
              </span>
            </div>

            <Label className={'sr-only'} htmlFor={'name'}>Name</Label>
            <Input id={'name'} className={'w-[400px] pl-6'} size={32} {...register('name')} />

            {errors.name && (
              <p className={'px-1 text-xs text-red-600'}>
                {errors.name.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button type={'submit'} isLoading={isLoading}>
            Change username
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserNameForm;