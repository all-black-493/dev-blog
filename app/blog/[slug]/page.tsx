import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/blog/blog-detail";
import { getPost } from "@/lib/actions/posts/get-post";
import { getBlogPostsMetadata } from "@/lib/actions/posts/get-post-metadata";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const result = await getPost({ postId: params.slug });

  if (!result || !result.data?.post) {
    notFound();
  }

  return <BlogDetail post={result.data?.post} />;
}

export async function generateStaticParams() {
  const result = await getBlogPostsMetadata();
  if (!result || !result.data?.metadata) return [];

  return result.data.metadata.map((post) => ({
    slug: post.id,
  }));
}
