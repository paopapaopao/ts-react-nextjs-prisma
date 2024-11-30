import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { CommentCardSkeleton } from '@/components';
import { comment } from '../mock-data';

describe('CommentCardSkeleton component', () => {
  it('should not render both the user image and the comment body', () => {
    render(<CommentCardSkeleton />);

    const image = screen.queryByRole('img');

    expect(image).not.toBeInTheDocument();
    expect(image).toBe(null);

    const body = screen.queryByText(comment.body);

    expect(body).not.toBeInTheDocument();
    expect(body).toBe(null);
  });
});
