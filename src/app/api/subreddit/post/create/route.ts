import { getAuthSession } from '@/lib/auth';
import { SubredditSubscriptionSchema } from '@/lib/validators/subreddit';
import { db } from '@/lib/db';
import { z } from 'zod';
import { PostSchema } from '@/lib/validators/post';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session)
      return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { title, content, subredditId } = PostSchema.parse(body);

    const subscriptionExists = await db.subscriptions.findFirst({
      where: {
        subredditId,
        // @ts-ignore
        userId: session.user.id
      }
    });

    if (!subscriptionExists)
      return new Response('Subscribe to post', { status: 400 });

    await db.post.create({
      data: {
        title,
        content,
        // @ts-ignore
        authorId: session.user.id,
        subredditId
      }
    });

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response(
      'Could not post subreddit at this time, please try again later.',
      { status: 500 }
    );
  }
}