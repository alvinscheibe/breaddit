import { PostVoteSchema } from '@/lib/validators/vote';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CachedPost } from '@/types/redis';
import { redis } from '@/lib/redis';
import { z } from 'zod';

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, voteType } = PostVoteSchema.parse(body);

    const session = await getAuthSession();

    if (!session)
      return new Response('Unauthorized', { status: 401 });

    const existingVote = await db.vote.findFirst({
      where: {
        postId,
        // @ts-ignore
        userId: session.user.id
      }
    });

    const post = await db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        votes: true,
        author: true
      }
    });

    if (!post)
      return new Response('Post not found', { status: 404 });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              // @ts-ignore
              userId: session.user.id,
            }
          }
        });

        return new Response('OK', { status: 200 });
      }

      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            // @ts-ignore
            userId: session.user.id,
          }
        },
        data: {
          type: voteType
        }
      });

      // recount the votes
      const votesAmount = post.votes.reduce((acc, vote) => {
        if (vote.type === 'UP')
          return acc + 1;
        if (vote.type === 'DOWN')
          return acc - 1;

        return acc;
      }, 0);

      if (votesAmount >= CACHE_AFTER_UPVOTES) {
        // create cache payload
        const cachePayload: CachedPost = {
          id: post.id,
          title: post.title,
          authorUsername: post.author.username ?? '',
          content: JSON.stringify(post.content),
          currentVote: voteType,
          createdAt: post.createdAt
        };

        await redis.hset(`post:${postId}`, cachePayload);
      }

      return new Response('OK', { status: 200 });
    }

    await db.vote.create({
      data: {
        type: voteType,
        // @ts-ignore
        userId: session.user.id,
        postId
      }
    });

    const votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP')
        return acc + 1;
      if (vote.type === 'DOWN')
        return acc - 1;

      return acc;
    }, 0);

    if (votesAmount >= CACHE_AFTER_UPVOTES) {
      // create cache payload
      const cachePayload: CachedPost = {
        id: post.id,
        title: post.title,
        authorUsername: post.author.username ?? '',
        content: JSON.stringify(post.content),
        currentVote: voteType,
        createdAt: post.createdAt
      };

      await redis.hset(`post:${postId}`, cachePayload);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response('Could not register your vote, please try again.', { status: 500 });
  }
}