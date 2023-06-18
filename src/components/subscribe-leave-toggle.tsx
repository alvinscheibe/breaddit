'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle = ({ subredditId, subredditName, isSubscribed }: SubscribeLeaveToggleProps) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post('/api/subreddit/subscribe', payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401)
          return loginToast();
      }

      return toast({
        title: 'There was an error',
        description: 'There was an error subscribing to this community. Please try again later.',
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: 'Subscribed',
        description: `You have successfully subscribed to r/${subredditName}.`,
      });
    }
  });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post('/api/subreddit/unsubscribe', payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401)
          return loginToast();
      }

      return toast({
        title: 'There was an error',
        description: 'There was an error unsubscribing to this community. Please try again later.',
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: 'Unsubscribed',
        description: `You have successfully unsubscribed from r/${subredditName}.`,
      });
    }
  });

  return (isSubscribed) ? (
    <Button className={'w-full mt-1 mb-4'} onClick={() => unsubscribe()} isLoading={isUnsubLoading}>
      Leave community
    </Button>
  ) : (
    <Button className={'w-full mt-1 mb-4'} onClick={() => subscribe()} isLoading={isSubLoading}>
      Join community
    </Button>
  );
};

export default SubscribeLeaveToggle;