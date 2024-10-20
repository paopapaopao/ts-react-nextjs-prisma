import { PostCard } from "@/components";
import { prisma } from "@/lib";
import { type DummyJSONPost } from "@/types";

const Page = async (): Promise<JSX.Element> => {
  const posts: DummyJSONPost[] = await prisma.post.findMany();

  return (
    <main>
      <ul className="p-8 flex flex-col items-center gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} isLink />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;
