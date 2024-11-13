import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostCardSkeleton } from '@/components';
import { post } from '../mock-data';

describe('PostCardSkeleton component', () => {
  it('should not render both the title and the body', () => {
    render(<PostCardSkeleton />);

    const title = screen.queryByRole('heading');

    expect(title).toBe(null);

    const body = screen.queryByText(post.body);

    expect(body).toBe(null);
  });
});
