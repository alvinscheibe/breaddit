import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Editor from '@/components/editor';

interface PageProps {
  params: {
    slug: string;
  }
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug
    }
  });

  if (!subreddit)
    return notFound();

  return (
    <div className={'flex flex-col items-start gap-6'}>
      <div className={'border-b border-gray-200 pb-5'}>
        <div className={'-ml-2 -mt-2 flex flex-wrap items-baseline'}>
          <h3 className={'ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'}>Create post</h3>
          <p className={'ml-2 mt-1 truncate text-sm text-gray-500'}>
            in r/{subreddit.name}
          </p>
        </div>
      </div>

      <Editor subredditId={subreddit.id} />

      <div className={'w-full flex justify-end'}>
        <Button type={'submit'} form={'subreddit-post-form'}>Post</Button>
      </div>
    </div>
  );
};

export default Page;