'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, Send, ArrowLeft, Image as ImageIcon, Tag, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import Link from 'next/link';
import TipTapEditor from '@/components/TipTapEditor';

const SUGGESTED_TAGS = ['technology', 'design', 'business', 'science', 'health', 'culture', 'programming', 'ai', 'productivity'];

export default function WritePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [postId, setPostId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  // Autosave every 30 seconds
  useEffect(() => {
    if (!title && !content) return;
    const timer = setTimeout(() => handleSave('draft', true), 30000);
    return () => clearTimeout(timer);
  }, [title, content]);

  const handleSave = async (status: 'draft' | 'published' = 'draft', silent = false) => {
    if (!title.trim()) { if (!silent) toast.error('Title is required'); return; }
    if (!silent) setSaving(true);

    try {
      const payload = {
        title, subtitle, content, thumbnail, tags,
        status,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || subtitle,
        readingTime: Math.max(1, Math.ceil(content.split(' ').length / 200)),
      };

      let response;
      if (postId) {
        response = await api.patch(`/api/posts/${postId}`, payload);
      } else {
        response = await api.post('/api/posts', payload);
        setPostId(response.data.data.id);
      }

      setLastSaved(new Date());
      if (!silent) toast.success(status === 'published' ? 'Article published! 🎉' : 'Draft saved');
      if (status === 'published') {
        router.push(`/article/${response.data.data.slug}`);
      }
    } catch (err: any) {
      if (!silent) toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!content || content === '<p></p>') { toast.error('Content is required'); return; }
    setPublishing(true);
    await handleSave('published');
    setPublishing(false);
  };

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Write toolbar */}
      <div style={{
        position: 'sticky', top: '64px', zIndex: 40,
        background: 'var(--bg-toolbar-rgba)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.75rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/dashboard">
            <button className="btn-ghost" style={{ padding: '0.5rem' }}>
              <ArrowLeft size={16} />
            </button>
          </Link>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Unsaved'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => setShowSettings(!showSettings)} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
            <Tag size={14} /> Settings
          </button>
          <button
            id="save-draft-btn"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save draft'}
          </button>
          <button
            id="publish-btn"
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            <Send size={14} /> {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Settings Panel */}
        {showSettings && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem',
          }} className="fade-in-up">
            <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>Article Settings</h3>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Thumbnail URL</label>
                <div style={{ position: 'relative' }}>
                  <ImageIcon size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    id="thumbnail-input"
                    type="url"
                    className="input-field"
                    style={{ paddingLeft: '2.75rem' }}
                    placeholder="https://example.com/image.jpg"
                    value={thumbnail}
                    onChange={e => setThumbnail(e.target.value)}
                  />
                </div>
                {thumbnail && (
                  <img src={thumbnail} alt="Thumbnail preview" style={{ marginTop: '0.75rem', borderRadius: '8px', maxHeight: '150px', objectFit: 'cover', width: '100%' }} />
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Tags (max 5)</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {tags.map(tag => (
                    <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }} className="tag">
                      {tag}
                      <button onClick={() => setTags(tags.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0 }}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="tag-input"
                    type="text"
                    className="input-field"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                    style={{ flex: 1 }}
                  />
                  <button onClick={() => addTag(tagInput)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Add</button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 6).map(tag => (
                    <button key={tag} onClick={() => addTag(tag)} style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '100px', padding: '0.2rem 0.625rem', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>SEO Title</label>
                  <input
                    id="seo-title-input"
                    type="text"
                    className="input-field"
                    placeholder="SEO title (optional)"
                    value={seoTitle}
                    onChange={e => setSeoTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>SEO Description</label>
                  <input
                    id="seo-desc-input"
                    type="text"
                    className="input-field"
                    placeholder="SEO description (optional)"
                    value={seoDesc}
                    onChange={e => setSeoDesc(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <textarea
          id="article-title"
          placeholder="Article title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            fontSize: 'clamp(2.25rem, 5vw, 3rem)', fontWeight: 800,
            color: 'var(--text-primary)', fontFamily: "'Merriweather', serif",
            lineHeight: 1.2, letterSpacing: '-0.02em',
            resize: 'none', overflow: 'hidden',
            marginBottom: '1rem',
          }}
          rows={2}
          onInput={e => {
            const ta = e.target as HTMLTextAreaElement;
            ta.style.height = 'auto';
            ta.style.height = ta.scrollHeight + 'px';
          }}
        />

        {/* Subtitle */}
        <input
          id="article-subtitle"
          type="text"
          placeholder="Add a subtitle (optional)"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            fontSize: '1.4rem', color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif",
            marginBottom: '2rem',
          }}
        />

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '2rem' }} />

        {/* Rich text editor */}
        <TipTapEditor
          content={content}
          onChange={setContent}
          placeholder="Tell your story..."
        />
      </div>
    </div>
  );
}
