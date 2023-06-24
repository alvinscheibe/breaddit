import { getAuthSession } from '@/lib/auth';
import { UsernameSchema } from '@/lib/validators/username';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session)
      return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name } = UsernameSchema.parse(body);

    const usernameExists = await db.user.findFirst({
      where: {
        username: name
      }
    });

    if (usernameExists)
      return new Response('Username already exists', { status: 409 });

    await db.user.update({
      where: {
        // @ts-ignore
        id: session.user.id
      },
      data: {
        username: name
      }
    });

    return new Response('OK', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response('Could not update username', {
      status: 500
    });
  }
}