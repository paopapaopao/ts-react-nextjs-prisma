import clsx from 'clsx';
import { type ReactNode } from 'react';
import styles from './Popover.module.css';

interface Props {
  children: ReactNode;
}

const Actions = ({ children }: Props): ReactNode => {
  const classNames: string = clsx(
    'mt-2 flex flex-col gap-4',
    'md:mt-3 md:flex-row md:gap-6',
    'xl:mt-4 xl:gap-8',
    styles.actions
  );

  return <div className={classNames}>{children}</div>;
};

export default Actions;
