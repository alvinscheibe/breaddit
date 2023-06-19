import { z } from 'zod';

export const PostSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters long'
  }).max(128,{
    message: 'Title must be at most 128 characters long'
  }),
  subredditId: z.string(),
  content: z.any()
});

export type CreatePostRequest = z.infer<typeof PostSchema>;