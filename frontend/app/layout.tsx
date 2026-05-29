import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'bLOgINN — Where Ideas Come Alive',
    template: '%s | bLOgINN',
  },
  description: 'bLOgINN is a modern publishing platform for writers and readers. Discover high-quality articles, share your ideas, and connect with a community of curious minds.',
  keywords: ['blog', 'writing', 'publishing', 'articles', 'stories'],
  authors: [{ name: 'bLOgINN' }],
  openGraph: {
    type: 'website',
    siteName: 'bLOgINN',
    title: 'bLOgINN — Where Ideas Come Alive',
    description: 'A modern publishing platform for curious minds.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: 'var(--bg-card)' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'var(--bg-card)' } },
          }}
        />
      </body>
    </html>
  );
}
