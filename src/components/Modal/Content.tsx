import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Content = ({ children }: Props): ReactNode => {
  return <div>{children}</div>;
};

export default Content;
