import { z } from 'zod';

export const SubredditSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters long'
  }).max(21, {
    message: 'Name must be at most 21 characters long'
  })
});

export const SubredditSubscriptionSchema = z.object({
  subredditId: z.string()
});

export type CreateSubredditPayload = z.infer<typeof SubredditSchema>;
export type SubscribeToSubredditPayload = z.infer<typeof SubredditSubscriptionSchema>;