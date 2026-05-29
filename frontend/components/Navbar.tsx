'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PenLine, Search, BookOpen, LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      toast.success('Dark mode activated 🌙');
    } else {
      document.documentElement.classList.remove('dark');
      toast.success('Light mode activated ☀️');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {}
    logout();
    localStorage.removeItem('accessToken');
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--bg-nav-rgba)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '6px',
            background: 'var(--logo-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={16} color="var(--bg-primary)" />
          </div>
          <span style={{ fontSize: '1.4rem', fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center' }} className="gradient-text">
            bLOgI<span style={{ fontStyle: 'italic', fontWeight: 900, textDecoration: 'underline', textUnderlineOffset: '3px' }}>NN</span>
          </span>
        </Link>

        {/* Search bar (desktop) */}
        <div style={{ flex: 1, maxWidth: '400px', margin: '0 2rem', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            id="search-input"
            type="text"
            placeholder="Search articles..."
            className="input-field"
            style={{ paddingLeft: '2.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.85rem' }}
            onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/search?q=${(e.target as HTMLInputElement).value}`); }}
          />
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Theme Toggler Button */}
          <button 
            onClick={toggleTheme}
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              marginRight: '0.25rem',
            }}
            title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard/write" id="write-article-btn">
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  <PenLine size={14} /> Write
                </button>
              </Link>
              <div style={{ position: 'relative' }}>
                <button
                  id="user-menu-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                >
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, color: 'white',
                    overflow: 'hidden',
                  }}>
                    {user?.avatar
                      ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : user?.name?.charAt(0).toUpperCase()
                    }
                  </div>
                  <ChevronDown size={14} color="var(--text-secondary)" />
                </button>

                {dropdownOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setDropdownOpen(false)} />
                     <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      width: '200px', background: 'var(--bg-card)',
                      border: '1px solid var(--border)', borderRadius: '12px',
                      padding: '0.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                      zIndex: 100,
                    }}>
                      <Link href={`/author/${user?.username}`} style={{ textDecoration: 'none' }}>
                        <button id="profile-link" className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => setDropdownOpen(false)}>
                          <User size={15} /> Profile
                        </button>
                      </Link>
                      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <button id="dashboard-link" className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => setDropdownOpen(false)}>
                          <PenLine size={15} /> Dashboard
                        </button>
                      </Link>
                      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
                      <button id="logout-btn" className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444' }} onClick={handleLogout}>
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" id="login-nav-btn">
                <button className="btn-ghost">Sign in</button>
              </Link>
              <Link href="/signup" id="signup-nav-btn">
                <button className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Get started</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
