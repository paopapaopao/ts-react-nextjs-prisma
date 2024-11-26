import clsx from 'clsx';
import { type ReactNode } from 'react';
import styles from './Modal.module.css';

interface Props {
  children: ReactNode;
}

const Actions = ({ children }: Props): ReactNode => {
  const classNames: string = clsx(
    'pt-2 flex flex-col gap-4',
    'md:pt-3 md:flex-row md:gap-6',
    'xl:pt-4 xl:gap-8',
    styles.actions
  );

  return <div className={classNames}>{children}</div>;
};

export default Actions;
