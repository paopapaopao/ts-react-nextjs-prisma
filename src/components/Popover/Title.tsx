import clsx from 'clsx';
import { type ReactNode } from 'react';
import { MdClose } from 'react-icons/md';

type Props = {
  children?: ReactNode | null;
  className?: string;
  onCloseClick: () => void;
};

export const Title = ({
  children = null,
  className = '',
  onCloseClick,
}: Props): ReactNode => {
  const classNames = clsx('flex', className);

  return (
    <div className={classNames}>
      <div className='basis-8' />
      <h2 className='flex-auto text-center leading-8 text-lg font-semibold'>
        {children}
      </h2>
      <button onClick={onCloseClick}>
        <MdClose
          size={32}
          className='text-popover-foreground'
        />
      </button>
    </div>
  );
};
