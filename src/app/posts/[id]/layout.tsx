import { type Metadata } from 'next';
import { type ReactNode } from 'react';

type Props = { children: ReactNode };

export const generateMetadata = async (props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const { id } = params;

  return { title: `Post ${id}` };
};

const Layout = ({ children }: Props): ReactNode => {
  return children;
};

export default Layout;
