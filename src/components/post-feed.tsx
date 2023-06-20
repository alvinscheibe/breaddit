'use client';

import { ExtentedPost } from '@/types/db';
import { useIntersection } from '@mantine/hooks';
import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { INFINITE_SCROLLILING_PAGINATION_RESULTS } from '@/config';
import axios from 'axios';
import { session } from 'next-auth/core/routes';
import { useSession } from 'next-auth/react';
import Post from '@/components/Post';

interface PostFeedProps {
  initialPosts: ExtentedPost[];
  subredditName?: string;
}

const PostFeed = ({ initialPosts, subredditName }: PostFeedProps) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery([
    'infinite-query',
  ], async ({ pageParam = 1 }) => {
    const query = `/api/posts?limit=${INFINITE_SCROLLILING_PAGINATION_RESULTS}&page=${pageParam}` +
      (!!subredditName ? `&subredditName=${subredditName}` : '');

    const { data } = await axios.get(query);

    return data as ExtentedPost[];
  }, {
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: {
      pages: [initialPosts],
      pageParams: [1],
    },
  });

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className={'flex flex-col col-span-2 space-y-6'}>
      {posts.map((post, index) => {
        const votesAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP')
            return acc + 1;

          if (vote.type === 'DOWN')
            return acc - 1;

          return acc;
        }, 0);

        // @ts-ignore
        const currentVote = post.votes.find((vote) => vote.userId === session?.user?.id);

        if (index === posts.length - 1)
          return <li key={post.id} ref={ref}><Post subredditName={post.subreddit.name} post={post} commentAmount={post.comments.length} /></li>
        else
        return <Post subredditName={post.subreddit.name} post={post} commentAmount={post.comments.length} />;
      })}
    </ul>
  );
};

export default PostFeed;