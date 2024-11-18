import { describe, expect, it, vi } from 'vitest';
import { type PostSchema } from '@/lib/types';
import {
  editPostPayload,
  newPostPayload,
  post,
  posts,
} from '@/tests/mock-data';

const createPost = async (payload: PostSchema) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
};

const readPost = async () => {
  const response = await fetch('/api/posts/1');
  const data = await response.json();

  return data;
};

const readPosts = async () => {
  const response = await fetch('/api/posts');
  const data = await response.json();

  return data;
};

const updatePost = async (payload: PostSchema) => {
  const response = await fetch('/api/posts/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
};

const responseProps = {
  headers: new Headers(),
  ok: true,
  redirected: false,
  status: 200,
  statusText: '',
  type: 'default',
  url: '',
  clone: function (): Response {
    throw new Error('Function not implemented.');
  },
  body: null,
  bodyUsed: false,
  arrayBuffer: function (): Promise<ArrayBuffer> {
    throw new Error('Function not implemented.');
  },
  blob: function (): Promise<Blob> {
    throw new Error('Function not implemented.');
  },
  formData: function (): Promise<FormData> {
    throw new Error('Function not implemented.');
  },
  text: function (): Promise<string> {
    throw new Error('Function not implemented.');
  },
};

describe('posts APIs', () => {
  describe('GET /api/posts', () => {
    it('should create and return mock post data', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          data: { post: newPostPayload },
          error: null,
          success: true,
        }),
        ...responseProps,
      } as Response);

      const data = await createPost(newPostPayload);

      expect(fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPostPayload),
      });

      expect(data).toEqual({
        data: { post: newPostPayload },
        error: null,
        success: true,
      });

      expect(fetch).toHaveBeenCalledOnce();
    });

    it('should read and return mock posts data', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          data: { posts },
          error: null,
          success: true,
        }),
        ...responseProps,
      } as Response);

      const data = await readPosts();

      expect(fetch).toHaveBeenCalledWith('/api/posts');

      expect(data).toEqual({
        data: { posts },
        error: null,
        success: true,
      });

      expect(fetch).toHaveBeenCalledOnce();
    });
  });

  describe('GET /api/posts/[id]', () => {
    it('should read and return mock post data', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          data: { post },
          error: null,
          success: true,
        }),
        ...responseProps,
      } as Response);

      const data = await readPost();

      expect(fetch).toHaveBeenCalledWith('/api/posts/1');

      expect(data).toEqual({
        data: { post },
        error: null,
        success: true,
      });

      expect(fetch).toHaveBeenCalledOnce();
    });

    it('should update and return mock post data', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          data: { post: editPostPayload },
          error: null,
          success: true,
        }),
        ...responseProps,
      } as Response);

      const data = await updatePost(editPostPayload);

      expect(fetch).toHaveBeenCalledWith('/api/posts/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPostPayload),
      });

      expect(data).toEqual({
        data: { post: editPostPayload },
        error: null,
        success: true,
      });

      expect(fetch).toHaveBeenCalledOnce();
    });
  });
});
