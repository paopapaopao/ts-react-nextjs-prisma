import { type Metadata } from 'next';
import { type ReactNode } from 'react';

type Params = {
  params: Promise<{ id: string }>;
};

type Props = { children: ReactNode };

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const { id } = await params;

  return { title: `Post ${id}` };
};

const Layout = ({ children }: Props): ReactNode => {
  return children;
};

export default Layout;
