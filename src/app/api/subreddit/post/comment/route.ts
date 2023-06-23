import { CommentSchema } from '@/lib/validators/comment';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, text, replyToId } = CommentSchema.parse(body);
    const session = await getAuthSession();

    if (!session)
      return new Response('Unauthorized', { status: 401 });

    await db.comment.create({
      data: {
        text,
        postId,
        // @ts-ignore,
        authorId: session.user.id,
        replyToId
      }
    });
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response(
      'Could not create comment, please try again.',
      { status: 500 }
    );
  }
}