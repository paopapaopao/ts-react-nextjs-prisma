import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export const Content = ({ children, className = '' }: Props): ReactNode => {
  return <div className={className}>{children}</div>;
};
