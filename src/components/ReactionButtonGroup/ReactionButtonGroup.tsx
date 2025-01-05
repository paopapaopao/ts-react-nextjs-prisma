'use client';

import { type ReactNode, Children, cloneElement, isValidElement } from 'react';
import { toast } from 'react-toastify';
import { ReactionType } from '@prisma/client';

import { useMutateReaction, useSignedInUser } from '@/lib/hooks';

type Props = {
  children: ReactNode;
  commentId?: number | null;
  postId?: number | null;
};

const ReactionButtonGroup = ({
  children,
  commentId = null,
  postId = null,
}: Props): ReactNode => {
  const { signedInUser } = useSignedInUser();

  const { mutate: createReaction } = useMutateReaction();

  const handleLikeClick = (type: ReactionType) => {
    return () => {
      // TODO
      const data = {
        type,
        userId: signedInUser?.id,
        clerkUserId: signedInUser?.clerkId,
        ...(postId && { postId, commentId: null }),
        ...(commentId && { commentId, postId: null }),
      };

      createReaction(data, {
        onSuccess: (): void => {
          toast.success('Reaction created successfully!');
        },
      });
    };
  };

  return Children.map(children, (child, index) => {
    if (!isValidElement(child)) {
      return null;
    }

    return cloneElement(child, {
      ...child.props,
      onClick: handleLikeClick(
        index === 0 ? ReactionType.LIKE : ReactionType.DISLIKE
      ),
    });
  });
};

export default ReactionButtonGroup;
