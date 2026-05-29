'use client';
import { useEffect, useState, useRef } from 'react';
import { TrendingUp, Zap, Star, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import PostCard from '@/components/PostCard';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const CATEGORIES = ['All', 'Technology', 'Design', 'Business', 'Science', 'Culture', 'Health'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.75
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 35, opacity: 0, filter: 'blur(4px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 110,
      damping: 17
    }
  }
};

export default function HomeContent({ startReveal = true }: { startReveal?: boolean }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (reset = false) => {
    try {
      setLoading(true);
      const params: any = { page: reset ? 1 : page, limit: 9 };
      if (activeCategory !== 'All') params.category = activeCategory.toLowerCase();
      const { data } = await api.get('/api/posts', { params });
      const newPosts = data.data.posts;
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(data.data.page < data.data.totalPages);
      if (!reset) setPage(p => p + 1);
    } catch {
      // API not connected yet - show empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setPage(1); fetchPosts(true); }, [activeCategory]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar Drop Down */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={startReveal ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <Navbar />
      </motion.div>

      {/* Hero Section */}
      <section style={{ 
        background: 'var(--bg-hero)', 
        borderBottom: '1px solid var(--border)',
        position: 'relative', 
        overflow: 'hidden',
        padding: '5rem 1.5rem',
      }}>
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', 
          gap: '3rem', 
          alignItems: 'center' 
        }} className="hero-grid">
          {/* Left Column: Typography Content */}
          <div style={{ textAlign: 'left', position: 'relative', zIndex: 10 }}>
            {/* THE MODERN PUBLISHING PLATFORM Badge */}
            <motion.div 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={startReveal ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '100px', padding: '0.375rem 1rem', marginBottom: '2rem',
              }}
            >
              <Zap size={12} color="var(--accent)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em' }}>THE MODERN PUBLISHING PLATFORM</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              initial={{ y: 35, opacity: 0, filter: 'blur(8px)' }}
              animate={startReveal ? { y: 0, opacity: 1, filter: 'blur(0px)' } : { y: 35, opacity: 0, filter: 'blur(8px)' }}
              transition={{ delay: 0.22, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ 
                fontFamily: "'Merriweather', serif", 
                fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)', 
                fontWeight: 800, 
                lineHeight: 1.1, 
                letterSpacing: '-0.04em', 
                marginBottom: '1.5rem',
                color: 'var(--text-primary)'
              }}
            >
              Where stories<br />
              & human ideas<br />
              <span className="gradient-text">come alive.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ y: 25, opacity: 0 }}
              animate={startReveal ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
              style={{ 
                fontSize: '1.25rem', 
                fontFamily: "'Inter', sans-serif",
                color: 'var(--text-secondary)', 
                lineHeight: 1.6, 
                marginBottom: '2.5rem', 
                maxWidth: '540px' 
              }}
            >
              A clean, premium space to read, write, and deepen your understanding on any topic that matters to you.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={startReveal ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.46, duration: 0.6, ease: 'easeOut' }}
              style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Link href="/signup" id="hero-start-writing-btn" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem', borderRadius: '100px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  Start reading <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="#feed" id="hero-explore-btn" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem', borderRadius: '100px', fontWeight: 500 }}>
                  Explore Stories
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Illustration Art */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={startReveal ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 0.95 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            className="hero-art-col"
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: '440px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/hero_creative_illustration.png" 
                alt="Creative writing editorial illustration" 
                style={{ width: '100%', height: 'auto', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={startReveal ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ delay: 0.58, duration: 0.8, ease: 'easeOut' }}
        style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', padding: '1.25rem 1.5rem', marginBottom: '3rem' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Writers', value: '10K+' },
            { label: 'Articles', value: '50K+' },
            { label: 'Readers', value: '500K+' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Category Filter + Feed */}
      <div id="feed" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Category filters bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={startReveal ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: 0.68, duration: 0.6, ease: 'easeOut' }}
          style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', marginBottom: '2rem' }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              id={`category-${cat.toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '100px',
                border: activeCategory === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: activeCategory === cat ? 'rgba(124,58,237,0.15)' : 'var(--bg-card)',
                color: activeCategory === cat ? 'var(--accent-light)' : 'var(--text-secondary)',
                fontWeight: activeCategory === cat ? 600 : 400,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >{cat}</button>
          ))}
        </motion.div>

        {/* Posts Grid with staggered spring entry */}
        {loading && posts.length === 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={startReveal ? "visible" : "hidden"}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                style={{ height: '320px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} 
              />
            ))}
          </motion.div>
        ) : posts.length > 0 ? (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={startReveal ? "visible" : "hidden"}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
            >
              {posts.map(post => (
                <motion.div key={post.id} variants={itemVariants}>
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
            
            {hasMore && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={startReveal ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}
              >
                <button id="load-more-btn" className="btn-secondary" onClick={() => fetchPosts()} disabled={loading}>
                  {loading ? 'Loading...' : 'Load more stories'}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={startReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}
          >
            <Star size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No stories yet</h3>
            <p style={{ fontSize: '0.9rem' }}>Be the first to publish here.</p>
            <Link href="/signup" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
              <button className="btn-primary">Start Writing</button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={startReveal ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{ borderTop: '1px solid var(--border)', marginTop: '5rem', padding: '3rem 1.5rem', textAlign: 'center' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px',
              background: 'var(--logo-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={14} color="var(--bg-primary)" />
            </div>
            <span style={{ fontSize: '1.2rem', fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center' }} className="gradient-text">
              bLOgI<span style={{ fontStyle: 'italic', fontWeight: 900, textDecoration: 'underline', textUnderlineOffset: '3px' }}>NN</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 bLOgINN · Built for curious minds</p>
        </div>
      </motion.footer>
    </div>
  );
}

