import type DummyJSONComment from './DummyJSONComment';

type DummyJSONPost = {
  id: number;
  body: string;
  title: string;
  comments: DummyJSONComment[];
};

export default DummyJSONPost;
