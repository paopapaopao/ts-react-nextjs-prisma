'use client';

import {
  type ReactNode,
  Attributes,
  Children,
  cloneElement,
  isValidElement,
  useEffect,
} from 'react';
import { useForm } from 'react-hook-form';
import { GrDislike, GrLike } from 'react-icons/gr';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactionType } from '@prisma/client';

import { useMutateReaction, useSignedInUser } from '@/lib/hooks';
import { reactionSchema } from '@/lib/schemas';
import { type ReactionSchema } from '@/lib/types';

type Props = {
  children: ReactNode;
  classNames?: string;
  commentId?: number | null;
  postId?: number | null;
};

const ReactionButtonGroup = ({
  children,
  classNames = '',
  commentId = null,
  postId = null,
}: Props): ReactNode => {
  const { signedInUser } = useSignedInUser();

  const { handleSubmit, setValue, reset } = useForm<ReactionSchema>({
    resolver: zodResolver(reactionSchema),
    defaultValues: {
      type: ReactionType.LIKE,
      userId: signedInUser?.id,
      clerkUserId: signedInUser?.clerkId,
      postId,
      commentId,
    },
  });

  const { mutate: createReaction } = useMutateReaction();

  // TODO: Refactor
  useEffect((): void => {
    if (signedInUser?.id) {
      reset({
        type: ReactionType.LIKE,
        userId: signedInUser?.id,
        clerkUserId: signedInUser?.clerkId,
        postId,
        commentId,
      });
    }
  }, [signedInUser, postId, commentId, reset]);

  const onSubmit = (data: ReactionSchema) => {
    createReaction(data, {
      onSuccess: (): void => {
        // TODO
        toast.success(
          <div className='flex items-center gap-2'>
            Reacted
            {data.type === ReactionType.LIKE ? (
              <GrLike size={16} />
            ) : (
              <GrDislike size={16} />
            )}
          </div>
        );
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames}
    >
      {Children.map(children, (child, index) =>
        !isValidElement(child)
          ? null
          : cloneElement(child, {
              onClick: () => {
                setValue(
                  'type',
                  index === 0 ? ReactionType.LIKE : ReactionType.DISLIKE
                );
              },
            } as Attributes)
      )}
    </form>
  );
};

export default ReactionButtonGroup;
