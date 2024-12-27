import clsx from 'clsx';
import { type ReactNode } from 'react';
import styles from './Popover.module.css';

type Props = { children: ReactNode };

const Actions = ({ children }: Props): ReactNode => {
  const classNames: string = clsx(
    'px-4 py-2 flex flex-col gap-4',
    'md:px-6 md:py-3 md:flex-row md:gap-6',
    'xl:px-8 xl:py-4 xl:gap-8',
    styles.actions
  );

  return <div className={classNames}>{children}</div>;
};

export default Actions;
