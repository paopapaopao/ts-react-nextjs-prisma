import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PostCardSkeleton } from '@/components';
import { post } from '../mock-data';

describe('PostCardSkeleton component', () => {
  it('should not render both the title and the body', () => {
    render(<PostCardSkeleton />);

    const title = screen.queryByRole('heading');

    expect(title).not.toBeInTheDocument();
    expect(title).toBe(null);

    const body = screen.queryByText(post.body);

    expect(body).not.toBeInTheDocument();
    expect(body).toBe(null);
  });
});
