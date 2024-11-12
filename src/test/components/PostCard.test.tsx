import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PostCard } from '@/components';
import { post } from '../mock-data';

describe('PostCard component', () => {
  it('should render both title and body', () => {
    render(<PostCard post={post} />);

    const title = screen.getByRole('heading');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(post.title);

    const body = screen.getByText(post.body);

    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent(post.body);
  });

  it("should be a link if 'isLink' prop is set to true", () => {
    render(
      <PostCard
        post={post}
        isLink
      />
    );

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/posts/${post.id}`);
  });

  it.skip(`should redirect to /posts/[id] on click if 'isLink' prop is set to true`, () => {});
});
