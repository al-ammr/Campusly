import { Metadata } from 'next';
import {
  getOpportunitiesDirectory,
  getCategoriesWithCounts,
  PublicListingSummary,
} from '@/lib/api/public-queries';
import { OpportunitiesClientView } from '@/components/opportunities/OpportunitiesClientView';

export const metadata: Metadata = {
  title: 'Opportunities | Campusly - Ahmadu Bello University',
  description:
    'Discover verified student internships, undergraduate grants, research fellowships, coding hackathons, and global exchange programmes curated for ABU Zaria students.',
  openGraph: {
    title: 'Student Opportunities | Campusly ABU Zaria',
    description:
      'Explore verified scholarships, SIWES attachments, and grant programs across Samaru & Kongo campuses.',
  },
};

interface OpportunitiesPageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    closing_soon?: string;
    cursor?: string;
  }>;
}

export const revalidate = 60;

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const { type, category, closing_soon, cursor } = await searchParams;
  const isClosingSoon = closing_soon === 'true' || closing_soon === '1';

  let oppsData: { items: PublicListingSummary[]; next_cursor: string | null } = {
    items: [],
    next_cursor: null,
  };
  let categories: Array<{ id: string; slug: string; name: string; icon_key?: string }> = [];

  const withTimeout = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
    ]);

  try {
    const [fetchedOpps, fetchedCategories] = await Promise.all([
      withTimeout(
        getOpportunitiesDirectory({
          type: type && type !== 'all' ? type : undefined,
          category: category && category !== 'all' ? category : undefined,
          closing_soon: isClosingSoon ? true : undefined,
          cursor,
          limit: 18,
        }),
        1500,
        { items: [], next_cursor: null }
      ),
      withTimeout(
        getCategoriesWithCounts().catch(() => []),
        1500,
        []
      ),
    ]);

    oppsData = fetchedOpps;
    categories = fetchedCategories || [];
  } catch (err) {
    console.error('Error fetching opportunities:', err);
    oppsData = { items: [], next_cursor: null };
  }

  return (
    <main className="min-h-screen bg-[#FFFFF0] dark:bg-canvas-dark transition-colors duration-fast">
      <OpportunitiesClientView
        initialOpportunities={oppsData.items}
        categories={categories}
        initialType={type || 'all'}
        initialCategory={category || ''}
        initialClosingSoon={isClosingSoon}
        nextCursor={oppsData.next_cursor}
      />
    </main>
  );
}
