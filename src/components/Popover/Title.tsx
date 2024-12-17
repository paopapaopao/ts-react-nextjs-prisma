import clsx from 'clsx';
import { type ReactNode } from 'react';
import { MdClose } from 'react-icons/md';

interface Props {
  children?: ReactNode | null;
  className?: string;
  onClick: () => void;
}

const Title = ({
  children = null,
  className = '',
  onClick,
}: Props): ReactNode => {
  const classNames: string = clsx('mb-2 flex', 'md:mb-3', 'xl:mb-4', className);

  return (
    <div className={classNames}>
      <div className='basis-8' />
      <h2 className='flex-auto text-center leading-8 text-lg font-semibold'>
        {children}
      </h2>
      <button onClick={onClick}>
        <MdClose size={32} />
      </button>
    </div>
  );
};

export default Title;
