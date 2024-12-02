import clsx from 'clsx';
import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import useCommentCard from './useCommentCard';

interface Props {
  onToggle: () => void;
}

const CommentCardActions = ({ onToggle }: Props): ReactNode => {
  const { comment } = useCommentCard();

  const handleClick = async (): Promise<void> => {
    await fetch(`/api/comments/${comment?.id}`, { method: 'DELETE' });
  };

  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  return (
    <div className={classNames}>
      <button onClick={onToggle}>
        <FaRegEdit size={16} />
      </button>
      <button onClick={handleClick}>
        <RiDeleteBin6Line size={16} />
      </button>
    </div>
  );
};

export default CommentCardActions;
