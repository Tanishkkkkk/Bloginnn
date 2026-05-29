import type { Metadata } from 'next';
import SearchContent from './SearchContent';

export const metadata: Metadata = {
  title: 'Search | bLOgINN',
  description: 'Search articles on bLOgINN',
};

export default function SearchPage() {
  return <SearchContent />;
}
