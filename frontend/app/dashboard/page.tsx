'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PenLine, Eye, Heart, FileText, TrendingUp, Plus, Edit2, Trash2, Globe, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

const TABS = ['Published', 'Drafts'];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Published');
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, totalClaps: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchData();
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'Published' ? 'published' : 'draft';
      const [postsRes, statsRes] = await Promise.allSettled([
        api.get('/api/posts/me', { params: { status, limit: 50 } }),
        api.get('/api/posts/me/stats'),
      ]);
      if (postsRes.status === 'fulfilled') setPosts(postsRes.value.data.data.posts || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await api.delete(`/api/posts/${id}`);
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success('Article deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Welcome back, {user?.name}
            </p>
          </div>
          <Link href="/dashboard/write" id="new-article-btn">
            <button className="btn-primary">
              <Plus size={16} /> New Article
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {[
            { icon: FileText, label: 'Total Articles', value: stats.totalPosts, color: '#7c3aed' },
            { icon: Eye, label: 'Total Views', value: stats.totalViews.toLocaleString(), color: '#06b6d4' },
            { icon: Heart, label: 'Total Claps', value: stats.totalClaps.toLocaleString(), color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '1.5rem',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={18} color={s.color} />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', width: 'fit-content', border: '1px solid var(--border)' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >{tab}</button>
          ))}
        </div>

        {/* Posts list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: '100px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <PenLine size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No {activeTab.toLowerCase()} articles yet</p>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Start writing something amazing</p>
            <Link href="/dashboard/write">
              <button className="btn-primary"><Plus size={14} /> Write Article</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {posts.map(post => (
              <div key={post.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '1.5rem',
                display: 'flex', gap: '1.5rem', alignItems: 'center',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                {post.thumbnail && (
                  <img src={post.thumbnail} alt={post.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <Link href={`/article/${post.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.title}
                      </h3>
                    </Link>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 600, padding: '0.125rem 0.5rem',
                      borderRadius: '100px',
                      background: post.status === 'published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: post.status === 'published' ? '#10b981' : '#f59e0b',
                      border: `1px solid ${post.status === 'published' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    }}>
                      {post.status === 'published' ? <Globe size={8} style={{ display: 'inline', marginRight: '3px' }} /> : <Lock size={8} style={{ display: 'inline', marginRight: '3px' }} />}
                      {post.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {post.publishedAt && <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={11} />{post._count?.views || 0}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Heart size={11} />{post._count?.claps || 0}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <Link href={`/dashboard/write?edit=${post.id}`}>
                    <button id={`edit-btn-${post.id}`} className="btn-ghost" style={{ padding: '0.5rem' }} title="Edit">
                      <Edit2 size={15} />
                    </button>
                  </Link>
                  <button
                    id={`delete-btn-${post.id}`}
                    onClick={() => handleDelete(post.id)}
                    className="btn-ghost"
                    style={{ padding: '0.5rem', color: '#ef4444' }}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
