import clsx from "clsx";
import { type ReactNode } from "react";
import { DummyJSONPost } from "@/types";
import styles from "./PostCard.module.css";

interface Props {
  className?: string;
  post: DummyJSONPost | null;
}

const PostCard = ({ className = "", post }: Props): ReactNode => {
  const classNames: string = clsx(
    "post-card",
    styles["post-card"],
    "px-8 py-4 flex flex-col gap-4 bg-zinc-800 rounded-lg shadow-lg text-white",
    className
  );

  return (
    <div className={classNames}>
      <h4 className={clsx("text-lg font-bold")}>{post?.title}</h4>
      <p className="text-base">{post?.body}</p>
    </div>
  );
};

export default PostCard;
