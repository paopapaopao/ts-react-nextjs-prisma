import clsx from 'clsx';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className: string;
}

const Content = ({ children, className }: Props): ReactNode => {
  const classNames: string = clsx('py-2', 'md:py-3', 'xl:py-4', className);

  return <div className={classNames}>{children}</div>;
};

export default Content;
