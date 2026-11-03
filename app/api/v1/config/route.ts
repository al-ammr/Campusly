import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse } from '@/lib/api/envelope';
import { getSetting } from '@/lib/settings';

export const GET = createApiHandler(
  {},
  async ({ requestId }) => {
    const [
      stdPrice,
      stdDays,
      featPrice,
      featDays,
      featSlotCap,
      closingSoonDays,
      dailySubmitCap,
      spotlightCap,
    ] = await Promise.all([
      getSetting('plan.standard.price'),
      getSetting('plan.standard.days'),
      getSetting('plan.featured.price'),
      getSetting('plan.featured.days'),
      getSetting('featured.slotCap'),
      getSetting('opportunity.closingSoonDays'),
      getSetting('submit.dailyCapPerDevice'),
      getSetting('spotlight.activeListingCap'),
    ]);

    const publicConfig = {
      app: {
        name: 'Campusly',
        short_name: 'Campusly',
        campus: 'Ahmadu Bello University, Zaria',
        operator: 'GDGOC ABU Zaria',
      },
      spotlight: {
        plans: {
          standard: {
            name: 'Standard Spotlight',
            price_kobo: stdPrice,
            days: stdDays,
            features: [
              'Listing in paid Spotlight section',
              'Search placement matching category & keywords',
              'Official contact channel link',
            ],
          },
          featured: {
            name: 'Featured Spotlight',
            price_kobo: featPrice,
            days: featDays,
            slot_cap: featSlotCap,
            features: [
              'Top homepage Spotlight rotating strip',
              'Prominent badge and border',
              'Search placement with priority rank',
              'Official contact channel link',
            ],
          },
        },
        active_listing_cap: spotlightCap,
      },
      opportunities: {
        closing_soon_days: closingSoonDays,
      },
      limits: {
        title_max_length: 100,
        summary_max_length: 280,
        description_max_length: 4000,
        image_max_bytes: 3145728, // 3MB
        proof_max_bytes: 5242880, // 5MB
        daily_submissions_per_device: dailySubmitCap,
      },
      pwa: {
        install_prompt_delay_seconds: 30,
        dismiss_days: 14,
      },
    };

    return createSuccessResponse(publicConfig, requestId, {
      cacheControl: 'public, max-age=300, s-maxage=600, stale-while-revalidate=1200',
    });
  }
);
