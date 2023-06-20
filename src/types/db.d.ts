import { Comment, Post, Subreddit, User, Vote } from '@prisma/client';

export type ExtentedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
}