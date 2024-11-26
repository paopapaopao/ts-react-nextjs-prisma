import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PostCardLink } from '@/components';
import { post } from '../mock-data';

describe('PostCardLink component', () => {
  it('should render both the title and the body', () => {
    render(<PostCardLink post={post} />);

    const title = screen.getByRole('heading');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(post.title);

    const body = screen.getByText(post.body);

    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent(post.body);
  });

  it('should be a link', () => {
    render(<PostCardLink post={post} />);

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/posts/${post.id}`);
  });

  it.skip('should redirect to the correct url on click', () => {});
});
