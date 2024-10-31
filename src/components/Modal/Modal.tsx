import clsx from 'clsx';
import { type ReactNode, type RefObject } from 'react';
import Actions from './Actions';
import Content from './Content';
import Title from './Title';
import styles from './Modal.module.css';

interface Props {
  children: ReactNode;
  innerRef: RefObject<HTMLDialogElement>;
}

const Modal = ({ children, innerRef }: Props): ReactNode => {
  const classNames: string = clsx('p-8 rounded-2xl', styles.modal);

  return (
    <dialog
      ref={innerRef}
      className={classNames}
    >
      {children}
    </dialog>
  );
};

Modal.Title = Title;
Modal.Content = Content;
Modal.Actions = Actions;

export default Modal;
