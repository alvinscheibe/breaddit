'use client';

import TextareaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import { CreatePostRequest, PostSchema } from '@/lib/validators/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import { uploadFiles } from '@/lib/uploadthing';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';

interface EditorProps {
  subredditId: string;
}

const Editor = ({ subredditId }: EditorProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreatePostRequest>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      subredditId: subredditId,
      title: '',
      content: null
    }
  });

  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
    const Code = (await import('@editorjs/code')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const InlineCode = (await import('@editorjs/inline-code')).default;
    const ImageTool = (await import('@editorjs/image')).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          // @ts-ignore
          ref.current = editor;
        },
        placeholder: 'Start writing your post...',
        inlineToolbar: true,
        data: {
          blocks: []
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [ res ] = await uploadFiles([file], 'imageUploader');

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    }
                  }
                }
              }
            }
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        }
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined')
      setIsMounted(true);
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: 'Something went wrong',
          description: (value as { message: string }).message,
          variant: 'destructive'
        });
      }
    }

  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: CreatePostRequest) {
    const blocks = await ref.current?.save();
    const payload: CreatePostRequest = {
      title: data.title,
      content: blocks,
      subredditId
    };

    createPost(payload);
  }

  const { mutate: createPost } = useMutation({
    mutationFn: async ({ title, content, subredditId }: CreatePostRequest) => {
      const payload: CreatePostRequest = {
        title, content, subredditId
      };
      const { data } = await axios.post('/api/subreddit/post/create', payload);
      return data;
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Your post could not be created. Please try again later.',
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      const newPathname = pathname.split('/').slice(0, -1).join('/');
      router.push(newPathname);
      router.refresh();
      return toast({
        description: 'Your post has been created.',
      });
    }
  });

  if (!isMounted)
    return null;

  const { ref: titleRef, ...rest } = register('title');

  return (
    <div className={'w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200'}>
      <form
        id={'subreddit-post-form'}
        className={'w-fit'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={'prose prose-stone dark:prose-invert'}>
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder={'Title'}
            className={'w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'}
          />

          <div id={'editor'} className={'min-h-[500px]'} />
        </div>
      </form>
    </div>
  );
};

export default Editor;