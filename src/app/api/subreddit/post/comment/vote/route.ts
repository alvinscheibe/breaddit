import { CommentVoteSchema } from '@/lib/validators/vote';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { commentId, voteType } = CommentVoteSchema.parse(body);

    const session = await getAuthSession();

    if (!session)
      return new Response('Unauthorized', { status: 401 });

    const existingVote = await db.commentVote.findFirst({
      where: {
        commentId,
        // @ts-ignore
        userId: session.user.id
      }
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              // @ts-ignore
              userId: session.user.id,
            }
          }
        });

        return new Response('OK', { status: 200 });
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              // @ts-ignore
              userId: session.user.id,
            }
          },
          data: {
            type: voteType
          }
        });

        return new Response('OK', { status: 200 });
      }
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        // @ts-ignore
        userId: session.user.id,
        commentId
      }
    });

    return new Response('OK', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response('Could not register your vote, please try again.', { status: 500 });
  }
}