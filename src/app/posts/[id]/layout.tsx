import { type Metadata } from 'next';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const generateMetadata = ({
  params: { id },
}: {
  params: { id: string };
}): Metadata => {
  return { title: `Post ${id}` };
};

const Layout = ({ children }: Props): ReactNode => {
  return children;
};

export default Layout;
