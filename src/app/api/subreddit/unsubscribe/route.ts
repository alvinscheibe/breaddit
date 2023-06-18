import { getAuthSession } from '@/lib/auth';
import { SubredditSubscriptionSchema } from '@/lib/validators/subreddit';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session)
      return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionSchema.parse(body);

    const subscriptionExists = await db.subscriptions.findFirst({
      where: {
        subredditId,
        // @ts-ignore
        userId: session.user.id
      }
    });

    if (!subscriptionExists)
      return new Response('You are not subscribed to this subreddit', { status: 400 });

    // check if user is the creator of the subreddit
    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        // @ts-ignore
        creatorId: session.user.id
      }
    });

    if (subreddit)
      return new Response('You cannot unsubscribe from a subreddit you created', { status: 400 });

    await db.subscriptions.delete({
      where: {
        userId_subredditId: {
          subredditId,
          // @ts-ignore
          userId: session.user.id
        }
      }
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response('Could not unsubscribe to subreddit', { status: 500 });
  }
}