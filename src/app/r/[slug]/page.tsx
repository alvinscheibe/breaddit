import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { INFINITE_SCROLLILING_PAGINATION_RESULTS } from '@/config';
import { notFound } from 'next/navigation';
import MiniCreatePost from '@/components/mini-create-post';
import PostFeed from '@/components/post-feed';

interface PageProps {
  params: {
    slug: string;
  }
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: INFINITE_SCROLLILING_PAGINATION_RESULTS
      }
    }
  });

  if (!subreddit)
    return notFound();

  return (
    <>
      <h1 className={'font-bold text-3xl md:text-4xl h-14'}>
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default Page;