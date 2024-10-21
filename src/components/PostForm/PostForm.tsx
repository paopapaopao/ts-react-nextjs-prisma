import { ReactNode } from 'react';
import { Button } from '../Button';

interface Props {
  action?: (formData: FormData) => void;
}

const PostForm = ({ action }: Props): ReactNode => {
  return (
    <form
      action={action}
      className='p-8 flex flex-col gap-4 bg-white rounded-lg shadow-md'
    >
      <label className='flex flex-col gap-2 text-sm font-bold text-gray-700'>
        Title
        <input
          type='text'
          name='title'
          placeholder='Enter title'
          className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
      </label>
      <label className='flex flex-col gap-2 text-sm font-bold text-gray-700'>
        Body
        <textarea
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
