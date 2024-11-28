import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type Comment } from '@prisma/client';
import { deleteComment } from '@/lib/actions';

const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = (await params).id;
  const comment: Comment | null = await deleteComment(Number(id));

  revalidatePath(`/posts/${comment?.id}`);

  return NextResponse.json({
    data: { comment },
    errors: null,
    success: true,
  });
};

export { DELETE };
