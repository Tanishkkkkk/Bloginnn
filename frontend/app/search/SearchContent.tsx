'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import { Suspense } from 'react';

function SearchInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setQuery(q); doSearch(q); }
  }, [searchParams]);

  const doSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get('/api/posts/search', { params: { q, limit: 20 } });
      setPosts(data.data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Search</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Find articles, topics, and writers</p>

        <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '3rem' }}>
          <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            id="search-query-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles, topics, authors..."
            className="input-field"
            style={{ paddingLeft: '3.25rem', paddingRight: '3.5rem', paddingTop: '1rem', paddingBottom: '1rem', fontSize: '1rem', borderRadius: '12px' }}
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setPosts([]); setSearched(false); }}
              style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}
            >
              <X size={18} />
            </button>
          )}
        </form>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: '280px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : searched && posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <Search size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No results for &ldquo;{query}&rdquo;</p>
            <p style={{ fontSize: '0.875rem' }}>Try different keywords or browse all articles</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {posts.length} result{posts.length !== 1 ? 's' : ''} for &ldquo;{searchParams.get('q')}&rdquo;
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)', opacity: 0.6 }}>
            <Search size={40} style={{ margin: '0 auto 1rem' }} />
            <p>Start typing to search articles</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchContent() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} />}>
      <SearchInner />
    </Suspense>
  );
}
