import { PostCard } from "@/components";
import { DummyJSONPost } from "@/types";
import clsx from "clsx";
import React from "react";

interface Props {
  params: {
    postId: string;
  };
}

const Page = async ({ params: { postId } }: Props): Promise<JSX.Element> => {
  const response: Response = await fetch(
    `https://dummyjson.com/posts/${postId}`
  );
  const post: DummyJSONPost = await response.json();

  const classNames: string = clsx(
    "post-details-page",
    "p-8 flex flex-col items-center gap-4"
  );

  return (
    <main className={classNames}>
      <h1 className="text-xl font-bold">Post {postId}</h1>
      <PostCard post={post} />
    </main>
  );
};

export default Page;
