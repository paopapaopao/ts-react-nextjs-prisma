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

interface Props {
  children: ReactNode;
  innerRef: RefObject<HTMLDialogElement>;
}

/**
 * !DANGER! using flex in dialog causes some bugs
 */

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

  const classNames: string = clsx(
    'p-4 min-w-[344px] w-[60vw] max-w-[50rem] min-h-[12rem] h-fit max-h-[50rem]',
    'md:p-6',
    'xl:p-8',
    'rounded-2xl bg-zinc-800 text-white'
  );

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
