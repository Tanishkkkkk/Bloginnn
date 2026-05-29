'use client';
import Link from 'next/link';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      position: 'relative',
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '3rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--logo-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={18} color="var(--bg-primary)" />
        </div>
        <span style={{ fontSize: '1.375rem', fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center' }} className="gradient-text">
          bLOgI<span style={{ fontStyle: 'italic', fontWeight: 900, textDecoration: 'underline', textUnderlineOffset: '3px' }}>NN</span>
        </span>
      </Link>

      <div className="fade-in-up">
        <div style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em', marginBottom: '1rem' }} className="gradient-text">
          404
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Page not found</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '3rem', maxWidth: '400px' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/">
            <button className="btn-primary">
              <Home size={16} /> Go Home
            </button>
          </Link>
          <button onClick={() => history.back()} className="btn-secondary">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
