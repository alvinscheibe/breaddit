import { z } from 'zod';

export const UsernameSchema = z.object({
  name: z.string().min(3).max(32).regex(/^[a-zA-Z0-9]+$/),
});

export type UsernameRequest = z.infer<typeof UsernameSchema>;