import { type ReactNode } from 'react';
import { MdClose } from 'react-icons/md';

interface Props {
  children: ReactNode;
  onClick: () => void;
}

const Title = ({ children, onClick }: Props): ReactNode => {
  return (
    <div className='flex'>
      <div className='basis-8' />
      <h2 className='flex-auto text-center leading-8 text-lg font-semibold text-gray-900'>
        {children}
      </h2>
      <button onClick={onClick}>
        <MdClose size={32} />
      </button>
    </div>
  );
};

export default Title;
