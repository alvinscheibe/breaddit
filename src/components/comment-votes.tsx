'use client';

import { CommentVote, VoteType } from '@prisma/client';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useState } from 'react';
import { usePrevious } from '@mantine/hooks';
import { Button } from '@/components/ui/button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { CommentVoteRequest } from '@/lib/validators/vote';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

type PartialVote = Pick<CommentVote, 'type'>
interface CommentVotesProps {
  commentId: string;
  initialVotesAmount: number;
  initialVote?: PartialVote;
}

const CommentVotes = ({ commentId, initialVotesAmount, initialVote }: CommentVotesProps) => {
  const { loginToast } = useCustomToast();
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const previousVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType: type,
      };

      await axios.patch('/api/subreddit/post/comment/vote', payload);
    },
    onError: (error, voteType) => {
      if (voteType === 'UP') setVotesAmount((prev) => prev - 1);
      else setVotesAmount((prev) => prev + 1);

      // reset current vote
      setCurrentVote(previousVote);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401)
          return loginToast();
      }

      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered. Please try again later.',
        variant: 'destructive'
      });
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === 'UP') setVotesAmount((prev) => prev - 1);
        else if (type === 'DOWN') setVotesAmount((prev) => prev + 1);
      } else {
        setCurrentVote({ type });
        if (type === 'UP') setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
        else if (type === 'DOWN') setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
      }
    }
  });

  return (
    <div className={'flex gap-1'}>
      <Button size={'sm'} variant={'ghost'} aria-label={'up vote'} onClick={() => vote('UP')}>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
          })}
        />
      </Button>

      <p className={'text-center py-2 font-medium text-sm text-zinc-900'}>
        {votesAmount}
      </p>

      <Button size={'sm'} variant={'ghost'} aria-label={'down vote'} onClick={() => vote('DOWN')}>
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;