'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import Actions from './Actions';
import Content from './Content';
import Title from './Title';
import styles from './Modal.module.css';

interface Props {
  children: ReactNode;
  innerRef: RefObject<HTMLDialogElement>;
}

const Modal = ({ children, innerRef }: Props): ReactNode => {
  const { back } = useRouter();

  const handleClick = (event: MouseEvent<HTMLDialogElement>): void => {
    const { clientX, clientY } = event;
    const { left, right, top, bottom } =
      event.currentTarget.getBoundingClientRect();

    if (
      clientX < left ||
      clientX > right ||
      clientY < top ||
      clientY > bottom
    ) {
      back();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>): void => {
    if (event.key === 'Escape') {
      back();
    }
  };

  const classNames: string = clsx('p-8 rounded-2xl', styles.modal);

  return (
    <dialog
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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
