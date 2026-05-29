import type { Metadata } from 'next';
import ArticleContent from './ArticleContent';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return { title: 'Article | bLOgINN' };
    const data = await res.json();
    const post = data.data;
    return {
      title: post.title,
      description: post.seoDesc || post.subtitle || post.title,
      openGraph: {
        title: post.title,
        description: post.seoDesc || post.subtitle,
        images: post.thumbnail ? [post.thumbnail] : [],
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author?.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.seoDesc || post.subtitle,
        images: post.thumbnail ? [post.thumbnail] : [],
      },
    };
  } catch {
    return { title: 'Article | bLOgINN' };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  return <ArticleContent slug={slug} />;
}
