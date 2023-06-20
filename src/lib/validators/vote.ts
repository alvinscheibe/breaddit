import { z } from 'zod';

export const PostVoteSchema = z.object({
  postId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
});

export type PostVoteRequest = z.infer<typeof PostVoteSchema>;

export const CommentVoteSchema = z.object({
  commentId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
});

export type CommentVoteRequest = z.infer<typeof CommentVoteSchema>;