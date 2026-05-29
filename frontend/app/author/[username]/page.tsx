import type { Metadata } from 'next';
import AuthorContent from './AuthorContent';

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${username}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return { title: 'Author | bLOgINN' };
    const data = await res.json();
    const author = data.data;
    return {
      title: `${author.name} | bLOgINN`,
      description: author.bio || `Read articles by ${author.name} on bLOgINN`,
      openGraph: {
        title: `${author.name} on bLOgINN`,
        description: author.bio,
        images: author.avatar ? [author.avatar] : [],
      },
    };
  } catch {
    return { title: 'Author | bLOgINN' };
  }
}

export default async function AuthorPage({ params }: Props) {
  const { username } = await params;
  return <AuthorContent username={username} />;
}
