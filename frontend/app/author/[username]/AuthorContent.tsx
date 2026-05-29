'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, FileText, Eye, Heart, UserCheck, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function AuthorContent({ username }: { username: string }) {
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useAuthStore();
  const [author, setAuthor] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const [authorRes, postsRes] = await Promise.all([
          api.get(`/api/users/${username}`),
          api.get('/api/posts', { params: { author: username, status: 'published', limit: 12 } }),
        ]);
        setAuthor(authorRes.data.data);
        setPosts(postsRes.data.data.posts || []);
        setFollowing(authorRes.data.data.isFollowing || false);
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [username]);

  const handleFollow = async () => {
    if (!isAuthenticated) { toast.error('Sign in to follow'); return; }
    setFollowLoading(true);
    try {
      if (following) {
        await api.delete(`/api/users/${author.id}/follow`);
        setAuthor((a: any) => ({ ...a, _count: { ...a._count, followers: a._count.followers - 1 } }));
        setFollowing(false);
        toast.success('Unfollowed');
      } else {
        await api.post(`/api/users/${author.id}/follow`);
        setAuthor((a: any) => ({ ...a, _count: { ...a._count, followers: a._count.followers + 1 } }));
        setFollowing(true);
        toast.success('Following!');
      }
    } catch {
      toast.error('Failed');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-card)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[200, 150, 100].map((w, i) => (
              <div key={i} style={{ height: i === 0 ? '28px' : '18px', width: `${w}px`, background: 'var(--bg-card)', borderRadius: '6px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!author) return null;

  const isOwn = currentUser?.username === username;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero banner */}
      <div style={{ height: '200px', background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(168,85,247,0.1) 50%, transparent 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.2), transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Profile section */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', marginTop: '-60px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: 800, color: 'white',
            overflow: 'hidden', flexShrink: 0,
            border: '4px solid var(--bg-primary)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          }}>
            {author.avatar
              ? <img src={author.avatar} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : author.name?.charAt(0)?.toUpperCase()
            }
          </div>

          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{author.name}</h1>
              {author.role === 'admin' && (
                <span style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '100px', padding: '0.2rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: '#a855f7', letterSpacing: '0.05em' }}>
                  ADMIN
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>@{author.username}</p>
            {author.bio && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '500px' }}>{author.bio}</p>
            )}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {author.location && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={12} />{author.location}
                </span>
              )}
              {author.createdAt && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} />Joined {format(new Date(author.createdAt), 'MMM yyyy')}
                </span>
              )}
            </div>
          </div>

          {!isOwn && (
            <button
              id="follow-btn"
              onClick={handleFollow}
              disabled={followLoading}
              className={following ? 'btn-secondary' : 'btn-primary'}
              style={{ alignSelf: 'center' }}
            >
              {following ? <><UserCheck size={15} /> Following</> : <><UserPlus size={15} /> Follow</>}
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2.5rem', padding: '1.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Articles', value: author._count?.posts || 0, icon: FileText },
            { label: 'Views', value: (author._count?.views || 0).toLocaleString(), icon: Eye },
            { label: 'Claps', value: (author._count?.claps || 0).toLocaleString(), icon: Heart },
            { label: 'Followers', value: (author._count?.followers || 0).toLocaleString(), icon: UserCheck },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <s.icon size={16} color="var(--accent-light)" />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.value}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Articles grid */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          {posts.length > 0 ? `Articles by ${author.name}` : 'No articles yet'}
        </h2>
        {posts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', paddingBottom: '5rem' }}>
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <FileText size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>No articles published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
