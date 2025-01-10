type DummyJSONPost = {
  id: number;
  title: string;
  body: string;
  userId: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
};

export default DummyJSONPost;
