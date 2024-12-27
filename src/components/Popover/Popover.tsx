'use client';

import clsx from 'clsx';
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import Actions from './Actions';
import Content from './Content';
import Title from './Title';

type Props = {
  children: ReactNode;
  className?: string;
  innerRef: RefObject<HTMLDialogElement>;
  onEscapeKeyDown?: (() => void) | null;
  onOutsideClick?: (() => void) | null;
};

const Popover = ({
  children,
  className = '',
  innerRef,
  onEscapeKeyDown = null,
  onOutsideClick = null,
}: Props): ReactNode => {
  const handleOutsideClick = (event: MouseEvent<HTMLDialogElement>): void => {
    const { clientX, clientY } = event;
    const { left, right, top, bottom } =
      event.currentTarget.getBoundingClientRect();

    if (clientX > left && clientX < right && clientY > top && clientY < bottom)
      return;

    if (onEscapeKeyDown !== null) {
      onOutsideClick?.();
    } else {
      innerRef?.current?.close();
    }
  };

  const handleEscapeKeyDown = (
    event: KeyboardEvent<HTMLDialogElement>
  ): void => {
    if (event.key !== 'Escape') return;

    if (onEscapeKeyDown !== null) {
      onEscapeKeyDown?.();
    } else {
      innerRef?.current?.close();
    }
  };

  const classNames: string = clsx(
    'min-w-[344px] w-[60vw] max-w-[50rem] min-h-[12rem] h-fit max-h-[50rem] flex-col',
    'rounded-2xl bg-zinc-800 text-white',
    className
  );

  return (
    <dialog
      onClick={handleOutsideClick}
      onKeyDown={handleEscapeKeyDown}
      ref={innerRef}
      className={classNames}
    >
      {children}
    </dialog>
  );
};

Popover.Title = Title;
Popover.Content = Content;
Popover.Actions = Actions;

export default Popover;
