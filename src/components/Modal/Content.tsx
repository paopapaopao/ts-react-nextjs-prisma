import clsx from 'clsx';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Content = ({ children }: Props): ReactNode => {
  const classNames: string = clsx('mb-4');

  return <div className={classNames}>{children}</div>;
};

export default Content;
