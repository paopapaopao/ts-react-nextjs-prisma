'use client';

import { ChangeEvent, ReactNode, useState } from 'react';
import { Prisma } from '@prisma/client';
import { Button } from '../Button';

interface Props {
  action: (formData: FormData) => void;
  post: Prisma.PostCreateInput | null;
}

const PostForm = ({ action, post = null }: Props): ReactNode => {
  const [formData, setFormData] = useState({
    title: post?.title ?? '',
    body: post?.body ?? '',
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form
      action={action}
      className='p-8 flex flex-col gap-4 bg-white rounded-lg shadow-md'
    >
      <label className='flex flex-col gap-2 text-sm font-bold text-gray-700'>
        Title
        <input
          value={formData.title}
          onChange={handleChange}
          name='title'
          type='text'
          placeholder='Enter title'
          className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
      </label>
      <label className='flex flex-col gap-2 text-sm font-bold text-gray-700'>
        Body
        <textarea
          value={formData.body}
          onChange={handleChange}
          name='body'
          placeholder='Enter body'
          className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none'
        />
      </label>
      <Button type='submit'>Create post</Button>
    </form>
  );
};

export default PostForm;
