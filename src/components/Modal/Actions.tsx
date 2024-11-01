import clsx from 'clsx';
import { type ReactNode } from 'react';
import styles from './Modal.module.css';

interface Props {
  children: ReactNode;
}

const Actions = ({ children }: Props): ReactNode => {
  const classNames: string = clsx('mt-4 flex gap-4', styles.actions);

  return <div className={classNames}>{children}</div>;
};

export default Actions;
