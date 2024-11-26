import clsx from 'clsx';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Content = ({ children }: Props): ReactNode => {
  const classNames: string = clsx('py-2', 'md:py-3', 'xl:py-4');

  return <div className={classNames}>{children}</div>;
};

export default Content;
