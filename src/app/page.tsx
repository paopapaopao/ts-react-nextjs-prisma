import { PostCard } from "@/components";
import { type DummyJSONPost } from "@/types";

const Page = async (): Promise<JSX.Element> => {
  const response: Response = await fetch(
    "https://dummyjson.com/posts?limit=0&select=id,body,title"
  );
  const data: { posts: DummyJSONPost[] } = await response.json();
  const posts: DummyJSONPost[] = data.posts;

  return (
    <main>
      <ul className="p-8 flex flex-col items-center gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;
