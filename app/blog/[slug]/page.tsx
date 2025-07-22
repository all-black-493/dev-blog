import { notFound } from 'next/navigation';
import { BlogDetail } from '@/components/blog/blog-detail';
import { blogPostsMetadata, getBlogPostById } from '@/lib/blog-data';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  const post = getBlogPostById(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogDetail post={post} />;
}

export function generateStaticParams() {
  return blogPostsMetadata.map((post) => ({
    slug: post.id,
  }));
}