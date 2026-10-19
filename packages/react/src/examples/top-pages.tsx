'use client';
// The animated preview from designme.dev, rebuilt from the React component: the totals roll up, the tracks fill in, and the switch re-sorts.
import { TopPages, type TopPagesPage } from '../components/top-pages/TopPages';

const PAGES: TopPagesPage[] = [
  { path: '/pricing', title: 'Pricing', views: 18420, change: 24 },
  { path: '/', title: 'Home', views: 15210, change: 3 },
  { path: '/components', title: 'Components', views: 9870, change: 41 },
  { path: '/docs/agent', title: 'Agent docs', views: 6340, change: -8 },
  { path: '/blog/soft-ui', title: 'Soft UI, the post', views: 4120, change: 112 },
  { path: '/changelog', title: 'Changelog', views: 2210, change: -14 }
];

export default function TopPagesDemo() {
  return <div style={{ width: '100%' }}><TopPages pages={PAGES} site="designme.dev" /></div>;
}
