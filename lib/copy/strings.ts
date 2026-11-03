/**
 * Campusly Interface Copy Strings
 * Source of Truth: D03 UI/UX Spec (Section 10) & D04 Brand Assets (Section 7)
 *
 * Rules:
 * - UI-601: All interface strings live in this resource file keyed by ID.
 * - COP-01: Plain language, friendly senior student tone, Grade 7 reading level.
 * - COP-06: Paid content is always labelled "Paid listing".
 * - COP-08: Use "communities", "events", "opportunities" as defined in D07.
 * - COP-10: No exclamation marks in errors, warnings, payment or legal text.
 * - COP-11: No emoji in system text.
 */

export const STRINGS = {
  // Common / App
  'app.name': 'Campusly',
  'app.tagline': 'Discover more beyond the classroom',
  'app.campus': 'Ahmadu Bello University, Zaria',
  'app.operator': 'Run by GDGOC ABU Zaria',
  'common.load_more': 'Load more',
  'common.loading': 'Loading...',
  'common.back': 'Back',
  'common.retry': 'Try again',
  'common.verified': 'Verified',
  'common.paid_listing': 'Paid listing',
  'common.closing_soon': 'Closing soon',
  'common.free': 'Free',
  'common.official_link': 'Official link',
  'common.contact': 'Contact',
  'common.clear_filters': 'Clear filters',
  'common.all': 'All',

  // Navigation
  'nav.home': 'Home',
  'nav.explore': 'Explore',
  'nav.events': 'Events',
  'nav.opportunities': 'Opportunities',
  'nav.spotlight': 'Spotlight',
  'nav.announcements': 'Announcements',
  'nav.submit': 'Submit',
  'nav.track': 'Track',
  'nav.more': 'More',

  // Home (7.1)
  'home.hero.title': 'Find your people, events and chances at ABU.',
  'home.hero.subtitle': 'Discover registered communities, campus gatherings, and student opportunities across Samaru and Kongo.',
  'home.search_placeholder': 'Search communities, events, opportunities...',
  'home.categories.heading': 'Explore categories',
  'home.categories.subheading': 'Browse active groups and societies by interest',
  'home.this_week.heading': 'This week at ABU',
  'home.this_week.subheading': 'Workshops, seminars and meetups happening in the next 7 days',
  'home.spotlight.heading': 'Student services & Spotlight',
  'home.spotlight.subheading': 'Campus businesses, tools and student offers',
  'home.closing_soon.heading': 'Opportunities closing soon',
  'home.closing_soon.subheading': 'Internships, grants and competitions with upcoming deadlines',
  'home.top_communities.heading': 'Popular communities',
  'home.top_communities.subheading': 'Student communities starred by fellow students',
  'home.view_all': 'View all',

  // Search (7.2)
  'search.title': 'Search',
  'search.placeholder': 'Type keywords, club name, or topic...',
  'search.filters.all': 'All results',
  'search.filters.community': 'Communities',
  'search.filters.event': 'Events',
  'search.filters.opportunity': 'Opportunities',
  'search.spotlight_heading': 'Promoted in Spotlight',
  'search.empty.title': 'No matches found',
  'search.empty.description': 'We could not find that. Try fewer words, check your spelling, or browse by category.',
  'search.results_count': '{count} results for "{query}"',

  // Explore & Categories (7.3)
  'explore.title': 'Explore Categories',
  'explore.subtitle': 'Discover clubs, societies and networks across ABU Zaria',
  'category.communities_heading': 'Communities in {category}',
  'category.empty.title': 'No approved communities here yet',
  'category.empty.description': 'Be the first to submit a community or society in this category.',
  'category.submit_action': 'Submit a community',

  // Community Detail (7.4)
  'community.about': 'About this community',
  'community.how_to_join': 'How to join',
  'community.who_can_join': 'Who can join',
  'community.meetings': 'Meeting schedule',
  'community.upcoming_events': 'Upcoming events by this community',
  'community.no_upcoming': 'No upcoming events scheduled right now.',
  'community.verified_badge_hint': 'Verified community recognized by GDGOC ABU Zaria.',
  'community.star_button': 'Star community',

  // Events (7.5)
  'events.title': 'Campus Events',
  'events.subtitle': 'Academic seminars, tech workshops, sports and social gatherings',
  'events.filter.when.upcoming': 'Upcoming',
  'events.filter.when.week': 'This week',
  'events.filter.when.past': 'Past events',
  'events.filter.free_only': 'Free events only',
  'events.detail.when': 'Date & Time',
  'events.detail.where': 'Venue & Location',
  'events.detail.add_calendar': 'Add to calendar (.ics)',
  'events.detail.register': 'Register for event',
  'events.detail.view_map': 'View map',
  'events.empty.title': 'No events found for this filter',
  'events.empty.description': 'Try switching between This Week and Upcoming, or submit an event happening in your faculty.',
  'events.submit_action': 'Submit an event',

  // Opportunities (7.6)
  'opportunities.title': 'Student Opportunities',
  'opportunities.subtitle': 'Internships, scholarships, bursaries, hackathons and grants for ABU students',
  'opportunities.filter.closing_soon': 'Closing soon',
  'opportunities.filter.all_types': 'All types',
  'opportunities.detail.deadline': 'Application deadline',
  'opportunities.detail.rolling': 'Rolling admissions / No fixed deadline',
  'opportunities.detail.eligibility': 'Eligibility criteria',
  'opportunities.detail.organiser': 'Organised by',
  'opportunities.detail.apply': 'Apply now',
  'opportunities.empty.title': 'No opportunities found',
  'opportunities.empty.description': 'There are no active opportunities matching your filter right now. Check back soon.',
  'opportunities.submit_action': 'Submit an opportunity',

  // Spotlight (7.7)
  'spotlight.title': 'Spotlight',
  'spotlight.subtitle': 'Discover campus services, student-led ventures, and promotional offers',
  'spotlight.featured_strip': 'Featured businesses',
  'spotlight.ranked_items': 'All Spotlight listings',
  'spotlight.paid_disclaimer': 'Paid listing — placements in Spotlight are paid by student businesses and campus initiatives.',
  'spotlight.empty.title': 'No active Spotlight listings',
  'spotlight.empty.description': 'Promote your campus service, startup or student business to thousands of ABU students.',
  'spotlight.post_action': 'Promote with Spotlight',

  // Announcements (7.8)
  'announcements.title': 'Campus Notices & Announcements',
  'announcements.subtitle': 'Official updates from GDGOC ABU Zaria and university coordinators',
  'announcements.pinned': 'Pinned notice',
  'announcements.empty.title': 'No announcements',
  'announcements.empty.description': 'There are currently no published official announcements.',

  // Data States (D03 Section 9)
  'state.not_available.title': 'Listing not available',
  'state.not_available.description': 'This listing is no longer available or does not exist.',
  'state.not_available.action': 'Return to homepage',
  'state.error.title': 'Could not load content',
  'state.error.description': 'Something went wrong while connecting to Campusly servers. Please check your connection.',
  'state.offline.title': 'You are offline',
  'state.offline.description': 'Saved pages still work. We will automatically refresh when you are back online.',
};

export type StringKey = keyof typeof STRINGS;

/**
 * Accessor for interface strings with optional parameter replacements.
 */
export function t(key: StringKey, replacements?: Record<string, string | number>): string {
  let val = STRINGS[key] || key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return val;
}
