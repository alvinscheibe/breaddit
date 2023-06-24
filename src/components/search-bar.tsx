'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { Prisma, Subreddit } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import debounce from 'lodash.debounce';

const SearchBar = () => {
  const [input, setInput] = useState<string>('');

  const { data: queryResults, refetch, isFetched, isFetching } = useQuery({
    queryFn: async () => {
      if (input.length < 3) return [];

      const { data } = await axios.get('/api/search?q=' + input);

      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ['search-query'],
    enabled: false,
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const router = useRouter();

  return (
    <Command className={'relative rounded-lg border max-w-lg z-50 overflow-visible'}>
      <CommandInput
        isLoading={false}
        className={'outline-none border-none focus:border-none focus:outline-none ring-0'}
        placeholder={'Search communities...'}
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
      />

      {input.length > 0 ? (
        <CommandList className={'absolute bg-white top-full inset-x-0 shadow rounded-b-md'}>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading={'Communities'}>
              {queryResults?.map((subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}
                  onSelect={(event) => {
                    router.push(`/r/${event}`);
                    router.refresh();
                  }}
                >
                  <Users className={'w-4 h-4 mr-2'} />
                  <a href={`/r/${subreddit.name}`}>
                    r/{subreddit.name}
                  </a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;