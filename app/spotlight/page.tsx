import { Metadata } from 'next';
import {
  getSpotlightDirectory,
  getCategoriesWithCounts,
  PublicSpotlightItem,
} from '@/lib/api/public-queries';
import { SpotlightClientView } from '@/components/spotlight/SpotlightClientView';

export const metadata: Metadata = {
  title: 'Campus Spotlight | Campusly - Ahmadu Bello University',
  description:
    'The student businesses and campus ventures working across Samaru and Kongo every day. Each listing is paid for and reviewed by the GDGOC team before it goes live, and students decide the ranking by starring the ones they use.',
  openGraph: {
    title: 'Campus Spotlight | Campusly ABU Zaria',
    description:
      'The student businesses and campus ventures working across Samaru and Kongo every day. Each listing is paid for and reviewed by the GDGOC team before it goes live, and students decide the ranking by starring the ones they use.',
  },
};

interface SpotlightPageProps {
  searchParams: Promise<{
    category?: string;
    cursor?: string;
  }>;
}

export const revalidate = 60;

export default async function SpotlightPage({ searchParams }: SpotlightPageProps) {
  const { category, cursor } = await searchParams;

  let spotlightData: {
    featured_strip: PublicSpotlightItem[];
    items: PublicSpotlightItem[];
    next_cursor: string | null;
  } = { featured_strip: [], items: [], next_cursor: null };

  let categories: Array<{ id: string; slug: string; name: string; icon_key?: string }> = [];

  const withTimeout = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
    ]);

  try {
    const [fetchedSpotlight, fetchedCategories] = await Promise.all([
      withTimeout(
        getSpotlightDirectory(category, cursor, 18),
        1500,
        { featured_strip: [], items: [], next_cursor: null }
      ),
      withTimeout(
        getCategoriesWithCounts().catch(() => []),
        1500,
        []
      ),
    ]);

    spotlightData = fetchedSpotlight;
    categories = fetchedCategories || [];
  } catch (err) {
    console.error('Error fetching spotlight directory:', err);
    spotlightData = { featured_strip: [], items: [], next_cursor: null };
  }

  return (
    <main className="min-h-screen bg-[#FFFFF0] dark:bg-canvas-dark transition-colors duration-fast">
      <SpotlightClientView
        initialFeatured={spotlightData.featured_strip}
        initialItems={spotlightData.items}
        categories={categories}
        initialCategory={category || ''}
        nextCursor={spotlightData.next_cursor}
      />
    </main>
  );
}
