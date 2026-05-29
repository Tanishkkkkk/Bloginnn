import type { Metadata } from 'next';
import ClientHomePage from './ClientHomePage';

export const metadata: Metadata = {
  title: 'bLOgINN — Where Ideas Come Alive',
  description: 'Discover high-quality articles from writers around the world. bLOgINN is the modern publishing platform for curious minds.',
};

export default function HomePage() {
  return <ClientHomePage />;
}
