import Link from 'next/link';
import { Clock, Eye, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  thumbnail?: string;
  readingTime: number;
  publishedAt?: string;
  tags: string[];
  author: { name: string; username: string; avatar?: string; };
  _count?: { claps: number; views: number; };
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <article
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.5)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(124,58,237,0.15)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {post.thumbnail && (
        <Link href={`/article/${post.slug}`} style={{ display: 'block', height: '200px', overflow: 'hidden' }}>
          <img
            src={post.thumbnail}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          />
        </Link>
      )}

      <div style={{ padding: '1.5rem' }}>
        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0,
            overflow: 'hidden',
          }}>
            {post.author.avatar
              ? <img src={post.author.avatar} alt={post.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : post.author.name.charAt(0).toUpperCase()
            }
          </div>
          <Link
            href={`/author/${post.author.username}`}
            style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
            onClick={e => e.stopPropagation()}
          >
            {post.author.name}
          </Link>
          {post.publishedAt && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              · {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/article/${post.slug}`} style={{ textDecoration: 'none' }}>
          <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
            {post.title}
          </h2>
          {post.subtitle && (
            <p style={{
              fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {post.subtitle}
            </p>
          )}
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {post.tags.slice(0, 3).map(tag => (
              <Link key={tag} href={`/search?q=${tag}`} style={{ textDecoration: 'none' }}>
                <span className="tag">{tag}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />{post.readingTime} min read
          </span>
          {post._count && (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Eye size={12} />{post._count.views}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Heart size={12} />{post._count.claps}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
