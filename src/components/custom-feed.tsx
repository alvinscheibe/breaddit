import { db } from '@/lib/db';
import { INFINITE_SCROLLILING_PAGINATION_RESULTS } from '@/config';
import PostFeed from '@/components/post-feed';
import { getAuthSession } from '@/lib/auth';

const CustomFeed = async () => {
  const session = await getAuthSession();

  const followedCommunities = await db.subscriptions.findMany({
    where: {
      // @ts-ignore
      userId: session?.user.id
    },
    include: {
      subreddit: true
    }
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        id: {
          in: followedCommunities.map((community) => community.subreddit.id)
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true
    },
    take: INFINITE_SCROLLILING_PAGINATION_RESULTS
  });

  return (
    <PostFeed initialPosts={posts} />
  );
};

export default CustomFeed;