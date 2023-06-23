'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { CommentRequest } from '@/lib/validators/comment';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useRouter } from 'next/navigation';

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
  const [input, setInput] = useState<string>('');
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId
      };

      const { data } = await axios.patch('/api/subreddit/post/comment', payload);

      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401)
          return loginToast();
      }

      return toast({
        title: 'There was an error',
        description: 'There was an error while trying to create your comment. Please try again later.',
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput('');
    }
  });

  return (
    <div className={'grid w-full gap-1.5'}>
      <Label htmlFor={'comment'}>
        Your comment
      </Label>
      <div className={'mt-2'}>
        <Textarea
          id={'comment'}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={1}
          placeholder={'What are your thoughts?'}
        />

        <div className={'flex mt-2 justify-end'}>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => comment({ postId, text: input, replyToId })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;