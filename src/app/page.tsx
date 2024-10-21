import { type Post } from "@prisma/client";
import { readPosts } from "@/apis";
import { PostCard } from "@/components";

const Page = async (): Promise<JSX.Element> => {
  const posts: Post[] = await readPosts({
    orderBy: {
      createdAt: "desc",
    },
  });

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
