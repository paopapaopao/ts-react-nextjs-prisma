import clsx from 'clsx';
import { type ReactNode } from 'react';
import { MdClose } from 'react-icons/md';

interface Props {
  children: ReactNode;
}

const Title = ({ children }: Props): ReactNode => {
  const classNames: string = clsx('mb-4 flex');

  return (
    <div className={classNames}>
      <div className='basis-8' />
      <h3 className='text-base font-semibold text-gray-900 basis-auto flex-auto text-center leading-8'>
        {children}
      </h3>
      <button>
        <MdClose size={32} />
      </button>
    </div>
  );
};

export default Title;
