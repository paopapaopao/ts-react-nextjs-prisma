import type DummyJSONPost from './DummyJSONPost';

type DummyJSONComment = {
  id: number;
  body: string;
  post: DummyJSONPost;
  postId: number;
};

export default DummyJSONComment;
