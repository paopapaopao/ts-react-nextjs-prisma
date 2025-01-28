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
import { type Post, type User, ReactionType } from '@prisma/client';

import {
  useCreateReaction,
  useDeleteReaction,
  useSignedInUser,
  useUpdateReaction,
} from '@/lib/hooks';
import { reactionSchema } from '@/lib/schemas';
import {
  type CommentWithRelationsAndRelationCountsAndUserReaction,
  type PostWithRelationsAndRelationCountsAndUserReaction,
  type ReactionSchema,
} from '@/lib/types';

type Props = {
  children: ReactNode;
  classNames?: string;
  commentId?: number | null;
  postId?: number | null;
  post?:
    | PostWithRelationsAndRelationCountsAndUserReaction
    | (Post & { user: User })
    | null;
  comment?: CommentWithRelationsAndRelationCountsAndUserReaction;
};

const ReactionButtonGroup = ({
  children,
  classNames = '',
  commentId = null,
  postId = null,
  post = null,
  comment = null,
}: Props): ReactNode => {
  const { signedInUser } = useSignedInUser();

  const { handleSubmit, setValue, reset, getValues } = useForm<ReactionSchema>({
    resolver: zodResolver(reactionSchema),
    defaultValues: {
      type: ReactionType.LIKE,
      userId: signedInUser?.id,
      clerkUserId: signedInUser?.clerkId,
      postId,
      commentId,
    },
  });

  const { mutate: createReaction } = useCreateReaction({
    postId: comment?.postId,
    parentCommentId: comment?.parentCommentId,
  });

  const { mutate: updateReaction } = useUpdateReaction({
    postId: post?.id || comment?.postId,
    parentCommentId: comment?.parentCommentId,
  });

  const { mutate: deleteReaction } = useDeleteReaction({
    postId: post?.id || comment?.postId,
    parentCommentId: comment?.parentCommentId,
  });

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

  const handleSuccess = (): void => {
    // TODO
    toast.success(
      <div className='flex items-center gap-2'>
        Reacted
        {getValues('type') === ReactionType.LIKE ? (
          <GrLike size={16} />
        ) : (
          <GrDislike size={16} />
        )}
      </div>
    );
  };

  const onSubmit = (data: ReactionSchema) => {
    if (post !== null && comment === null) {
      if ('userReaction' in post && post.userReaction === null) {
        createReaction(data, { onSuccess: handleSuccess });
      }

      if (
        'userReaction' in post &&
        post.userReaction !== null &&
        post?.userReaction?.type !== data.type
      ) {
        updateReaction(
          { id: post?.userReaction?.id, payload: data },
          { onSuccess: handleSuccess }
        );
      }

      if (
        'userReaction' in post &&
        post.userReaction !== null &&
        post?.userReaction?.type === data.type
      ) {
        deleteReaction(post.userReaction.id, { onSuccess: handleSuccess });
      }
    }

    if (post === null && comment !== null) {
      if ('userReaction' in comment && comment.userReaction === null) {
        createReaction(data, { onSuccess: handleSuccess });
      }

      if (
        'userReaction' in comment &&
        comment.userReaction !== null &&
        comment?.userReaction?.type !== data.type
      ) {
        updateReaction(
          { id: comment?.userReaction?.id, payload: data },
          { onSuccess: handleSuccess }
        );
      }

      if (
        'userReaction' in comment &&
        comment.userReaction !== null &&
        comment?.userReaction?.type === data.type
      ) {
        deleteReaction(comment.userReaction.id, { onSuccess: handleSuccess });
      }
    }
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
