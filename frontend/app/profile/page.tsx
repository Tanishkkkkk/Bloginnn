'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, AtSign, FileText, MapPin, Link as LinkIcon, Save, Camera } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    avatar: '',
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user) {
      setForm({
        name: user.name || '',
        username: user.username || '',
        bio: (user as any).bio || '',
        location: (user as any).location || '',
        website: (user as any).website || '',
        avatar: user.avatar || '',
      });
    }
  }, [isAuthenticated, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch('/api/users/me', form);
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const TABS = ['Profile', 'Account'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '2rem' }}>Settings</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2.5rem', background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', width: 'fit-content', border: '1px solid var(--border)' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none',
                background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >{tab}</button>
          ))}
        </div>

        {activeTab === 'Profile' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, color: 'white',
                overflow: 'hidden', position: 'relative', flexShrink: 0,
              }}>
                {form.avatar
                  ? <img src={form.avatar} alt={form.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : form.name?.charAt(0)?.toUpperCase()
                }
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  <Camera size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                  Avatar URL
                </label>
                <input
                  id="avatar-input"
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                  value={form.avatar}
                  onChange={e => setForm({ ...form, avatar: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  <User size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  className="input-field"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  <AtSign size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />Username
                </label>
                <input
                  id="profile-username"
                  type="text"
                  className="input-field"
                  placeholder="username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value.toLowerCase() })}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                <FileText size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />Bio
              </label>
              <textarea
                id="profile-bio"
                className="input-field"
                placeholder="Tell readers a bit about yourself..."
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={4}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{form.bio.length}/200 characters</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />Location
                </label>
                <input
                  id="profile-location"
                  type="text"
                  className="input-field"
                  placeholder="San Francisco, CA"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  <LinkIcon size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />Website
                </label>
                <input
                  id="profile-website"
                  type="url"
                  className="input-field"
                  placeholder="https://yourwebsite.com"
                  value={form.website}
                  onChange={e => setForm({ ...form, website: e.target.value })}
                />
              </div>
            </div>

            <button
              id="save-profile-btn"
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {activeTab === 'Account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Email Address</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{user?.email}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} color="var(--text-muted)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email changes require verification</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#ef4444' }}>Danger Zone</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                className="btn-secondary"
                style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                onClick={() => toast.error('Contact support to delete your account')}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
