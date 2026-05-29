'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Eye, ArrowLeft, Heart, Share2, Link2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

export default function ArticleContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clapping, setClapping] = useState(false);
  const [clapped, setClapped] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/api/posts/${slug}`);
        setPost(data.data);
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleClap = async () => {
    if (!isAuthenticated) { toast.error('Sign in to clap'); return; }
    if (!post || clapped) return;
    setClapping(true);
    try {
      await api.post('/api/claps', { postId: post.id, count: 1 });
      setPost((p: any) => ({ ...p, _count: { ...p._count, claps: (p._count?.claps || 0) + 1 } }));
      setClapped(true);
      toast.success('👏 Clapped!');
    } catch {
      toast.error('Failed to clap');
    } finally {
      setClapping(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '0 1.5rem' }}>
        {[80, 40, 60, 100, 70, 90, 55, 80, 65].map((w, i) => (
          <div key={i} style={{
            height: i === 0 ? '48px' : '20px',
            background: 'var(--bg-card)', borderRadius: '8px',
            marginBottom: '1rem', width: `${w}%`,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
      </div>
    </div>
  );

  if (!post) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        {/* Back */}
        <button id="back-btn" onClick={() => router.back()} className="btn-ghost" style={{ marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {post.tags.map((tag: string) => (
              <Link key={tag} href={`/search?q=${tag}`} style={{ textDecoration: 'none' }}>
                <span className="tag">{tag}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: 'clamp(2.25rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          {post.title}
        </h1>
        {post.subtitle && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.4rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '2rem' }}>
            {post.subtitle}
          </p>
        )}

        {/* Author + meta bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1.5rem 0',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          marginBottom: '2.5rem',
        }}>
          <Link href={`/author/${post.author?.username}`}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: 'white', overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
            }}>
              {post.author?.avatar
                ? <img src={post.author.avatar} alt={post.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : post.author?.name?.charAt(0)?.toUpperCase()
              }
            </div>
          </Link>
          <div style={{ flex: 1 }}>
            <Link href={`/author/${post.author?.username}`} style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
              {post.author?.name}
            </Link>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              {post.publishedAt && <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} />{post.readingTime} min read</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={12} />{post._count?.views || 0}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              id="clap-btn"
              onClick={handleClap}
              disabled={clapping || clapped}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                background: clapped ? 'rgba(124,58,237,0.15)' : 'none',
                border: clapped ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
                borderRadius: '8px', padding: '0.5rem 0.75rem',
                cursor: clapped ? 'default' : 'pointer', color: clapped ? '#a855f7' : 'var(--text-secondary)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!clapped) (e.currentTarget.style.color = '#a855f7'); }}
              onMouseLeave={e => { if (!clapped) (e.currentTarget.style.color = 'var(--text-secondary)'); }}
            >
              <Heart size={18} fill={clapped ? '#a855f7' : 'none'} />
              <span style={{ fontSize: '0.7rem' }}>{post._count?.claps || 0}</span>
            </button>
            <button onClick={() => handleShare('twitter')} className="btn-ghost" style={{ padding: '0.5rem' }} title="Share on Twitter">
              <Share2 size={16} />
            </button>
            <button id="copy-link-btn" onClick={() => handleShare('copy')} className="btn-ghost" style={{ padding: '0.5rem' }} title="Copy link">
              <Link2 size={16} />
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
            <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }} />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose-bloginn"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
          style={{ marginBottom: '4rem' }}
        />

        {/* Bottom clap CTA */}
        <div style={{ textAlign: 'center', padding: '3rem 0', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Did you enjoy this article?</p>
          <button
            onClick={handleClap}
            disabled={clapping || clapped}
            style={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
              background: clapped ? 'rgba(124,58,237,0.15)' : 'var(--bg-card)',
              border: `1px solid ${clapped ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
              borderRadius: '50%', width: '72px', height: '72px',
              cursor: clapped ? 'default' : 'pointer', color: clapped ? '#a855f7' : 'var(--text-secondary)',
              transition: 'all 0.2s', fontSize: '0.7rem',
            }}
          >
            <Heart size={24} fill={clapped ? '#a855f7' : 'none'} />
            <span>{post._count?.claps || 0}</span>
          </button>
        </div>

        {/* Author bio card */}
        {post.author && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '2rem', marginTop: '2rem',
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <Link href={`/author/${post.author.username}`}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: 'white', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
                  {post.author.avatar ? <img src={post.author.avatar} alt={post.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : post.author.name?.charAt(0)?.toUpperCase()}
                </div>
              </Link>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Written by</p>
                <Link href={`/author/${post.author.username}`} style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                  {post.author.name}
                </Link>
                {post.author.bio && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
