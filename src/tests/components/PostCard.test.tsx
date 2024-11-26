import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard } from '@/components';
import { comments, post } from '../mock-data';

describe('PostCard component', () => {
  it('should render both the title and the body', () => {
    const postWithComments = { ...post, comments };

    render(<PostCard post={postWithComments} />);

    const title = screen.getByRole('heading');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(post.title);

    const body = screen.getByText(post.body);

    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent(post.body);
  });

  it('should render the comments count <span /> if there are comments', () => {
    const postWithComments = { ...post, comments };

    render(<PostCard post={postWithComments} />);

    const span = screen.getByText(/\d+ comments/);

    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent(
      `${postWithComments.comments.length} comments`
    );
  });

  it('should not render the comments count <span /> if there are no comments', () => {
    const postWithComments = { ...post, comments: [] };

    render(<PostCard post={postWithComments} />);

    const span = screen.queryByText(/\d+ comments/);

    expect(span).not.toBeInTheDocument();
    expect(span).toBe(null);
  });

  it('should toggle the comment list <ul /> visibility if the comments count <span /> is clicked', async () => {
    const postWithComments = { ...post, comments };

    render(<PostCard post={postWithComments} />);

    const span = screen.getByText(/\d+ comments/);
    let commentList = screen.queryByRole('list');

    expect(commentList).not.toBeInTheDocument();
    expect(commentList).toBe(null);

    await userEvent.click(span);

    commentList = screen.queryByRole('list');

    expect(commentList).toBeInTheDocument();
  });
});
