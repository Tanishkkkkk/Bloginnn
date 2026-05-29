'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, BookOpen, Mail, Lock, User, AtSign, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/signup', form);
      setUser(data.data.user, data.data.accessToken);
      localStorage.setItem('accessToken', data.data.accessToken);
      toast.success('Account created! Welcome to bLOgINN 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative',
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative' }} className="fade-in-up">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--logo-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color="var(--bg-primary)" />
            </div>
            <span style={{ fontSize: '1.5rem', fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center' }} className="gradient-text">
              bLOgI<span style={{ fontStyle: 'italic', fontWeight: 900, textDecoration: 'underline', textUnderlineOffset: '3px' }}>NN</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join thousands of writers and readers</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input id="signup-name" type="text" className="input-field" style={{ paddingLeft: '2.75rem' }} placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <AtSign size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input id="signup-username" type="text" className="input-field" style={{ paddingLeft: '2.75rem' }} placeholder="johndoe" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase() })} required />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input id="signup-email" type="email" className="input-field" style={{ paddingLeft: '2.75rem' }} placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input id="signup-password" type={showPassword ? 'text' : 'password'} className="input-field" style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }} placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password strength */}
            {form.password.length > 0 && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    flex: 1, height: '3px', borderRadius: '2px',
                    background: form.password.length >= i * 2
                      ? i <= 1 ? '#ef4444' : i <= 2 ? '#f59e0b' : i <= 3 ? '#10b981' : '#7c3aed'
                      : 'var(--border)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
            )}

            <button id="signup-submit-btn" type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }} disabled={loading}>
              {loading ? 'Creating account...' : <><span>Create account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link href="/login" id="go-to-login-link" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
