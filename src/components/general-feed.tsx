import { db } from '@/lib/db';
import { INFINITE_SCROLLILING_PAGINATION_RESULTS } from '@/config';
import PostFeed from '@/components/post-feed';

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
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

export default GeneralFeed;