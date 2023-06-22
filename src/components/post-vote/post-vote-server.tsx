import { Post, Vote, VoteType } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import PostVoteClient from '@/components/post-vote/post-vote-client';

interface PostVoteServerProps {
  postId: string;
  initialAmount?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer = async ({ postId, initialAmount, initialVote, getData }: PostVoteServerProps) => {
  const session = await getServerSession();

  let _votesAmount: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();

    if (!post)
      return notFound();

    _votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP')
        return acc + 1;
      if (vote.type === 'DOWN')
        return acc - 1;

      return acc;
    }, 0);

    // @ts-ignore
    _currentVote = post.votes.find((vote) => vote.userId === session.user.id)?.type;
  } else {
    _votesAmount = initialAmount!;
    _currentVote = initialVote;
  }

  return (
    <PostVoteClient postId={postId} initialVotesAmount={_votesAmount} initialVote={_currentVote} />
  );
};

export default PostVoteServer;