'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default, {
    ssr: false
  }
);

interface EditorOutputProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutput = ({ content }: EditorOutputProps) => {
  return (
    // @ts-ignore
    <Output
      data={content}
      style={style}
      className={'text-sm'}
      renderers={renderers}
    />
  );
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className={'relative w-full min-h-[15rem]'}>
      <Image src={src} alt={'image'} className={'object-contain'} fill={true} />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className={'bg-gray-800 p-4 rounded-md'}>
      <code className={'text-gray-100 text-sm'}>
        {data.code}
      </code>
    </pre>
  );
}

export default EditorOutput;