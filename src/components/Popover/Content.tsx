import clsx from 'clsx';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const Content = ({ children, className = '' }: Props): ReactNode => {
  const classNames: string = clsx(className);

  return <div className={classNames}>{children}</div>;
};

export default Content;
