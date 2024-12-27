import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

const Content = ({ children, className = '' }: Props): ReactNode => {
  return <div className={className}>{children}</div>;
};

export default Content;
