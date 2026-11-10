import * as React from 'react';
import type { Metadata } from 'next';
import { getCategoriesWithCounts } from '@/lib/api/public-queries';
import { ExploreClientView, CategoryItem } from '@/components/explore/ExploreClientView';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Explore | Campusly - Ahmadu Bello University',
  description:
    'Browse all registered student communities, academic societies, engineering clubs, events, and student ventures across ABU Zaria.',
};

export default async function ExplorePage() {
  let categories: CategoryItem[] = [];
  try {
    const rawCategories = await getCategoriesWithCounts();
    categories = (rawCategories || []).map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      icon_key: cat.icon_key,
      sort: cat.sort,
      live_communities: cat.live_communities || 0,
      upcoming_events: cat.upcoming_events || 0,
    }));
  } catch (err) {
    // Leave empty when database is unavailable — zero fake inventions
    categories = [];
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFFF0] dark:bg-surface-dark pb-16">
      <ExploreClientView initialCategories={categories} />
    </div>
  );
}
