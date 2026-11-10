'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Store,
  Tag,
  Laptop,
  Award,
  UtensilsCrossed,
  Check,
  PlusCircle,
} from 'lucide-react';

export interface CampusBusinessItem {
  id: string;
  rank: number;
  name: string;
  category: string;
  score: number;
  initialVotes: number;
  verified: boolean;
  location: string;
  description: string;
  featuredOffer: string;
  images: string[];
  actionLabel: string;
  actionLink: string;
}

export const TOP_CAMPUS_BUSINESSES: CampusBusinessItem[] = [
  {
    id: 'biz-01',
    rank: 1,
    name: 'Apex Print & Publishing Hub',
    category: 'Printing & Publishing',
    score: 9.9,
    initialVotes: 248,
    verified: true,
    location: 'Opposite Faculty of Environmental Design, Samaru',
    description:
      'High-speed digital laser printing, architectural blueprint drafting, hardcover binding, and thesis publishing trusted by final-year students.',
    featuredOffer: 'Free spiral binding on project dissertations over 50 pages',
    images: [
      'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'Order Prints on WhatsApp',
    actionLink: 'https://wa.me/2348011223344?text=Hello%20Apex%20Print%20Hub,%20I%20saw%20your%20Campusly%20listing!',
  },
  {
    id: 'biz-02',
    rank: 2,
    name: 'Samaru Tech & Gadget Repair',
    category: 'Tech & Electronics',
    score: 9.8,
    initialVotes: 195,
    verified: true,
    location: 'North Gate Commercial Plaza, Samaru Campus',
    description:
      'Laptop motherboard repairs, screen replacements, iPhone/Android software flashing, and battery renewals with 30-day warranty.',
    featuredOffer: 'Free diagnostic screening for all ABU students with valid ID',
    images: [
      'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1597740985671-2a8a3b805331?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'Book Repair Diagnosis',
    actionLink: 'https://wa.me/2348022334455?text=Hello%20Samaru%20Tech,%20I%20need%20a%20repair%20diagnosis',
  },
  {
    id: 'biz-03',
    rank: 3,
    name: 'Green Buka Student Bistro',
    category: 'Food & Catering',
    score: 9.7,
    initialVotes: 310,
    verified: true,
    location: 'Kongo Campus Food Court & Hall Quadrangle',
    description:
      'Hygienic, affordable Nigerian and continental meals: jollof rice, pounded yam with egusi, grilled chicken, and healthy fruit salads.',
    featuredOffer: 'Complimentary zobo or chilled drink with daily special rice bowls',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'View Menu & Order',
    actionLink: 'https://wa.me/2348033445566?text=Hi%20Green%20Buka,%20I%20want%20to%20order%20food',
  },
  {
    id: 'biz-04',
    rank: 4,
    name: 'Zaria CodeCraft Studio',
    category: 'Software & Design Services',
    score: 9.6,
    initialVotes: 142,
    verified: true,
    location: 'Institute of Computing Walkway, Samaru',
    description:
      'Web application development, UI/UX prototyping in Figma, mobile app builds, and cloud deployment mentorship for student startups.',
    featuredOffer: '20% discount on final year software projects & portfolios',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'Discuss Dev Project',
    actionLink: 'https://wa.me/2348044556677?text=Hi%20CodeCraft,%20let%20us%20discuss%20a%20project',
  },
  {
    id: 'biz-05',
    rank: 5,
    name: 'Kongo Legal & Academic Binding',
    category: 'Legal & Secretarial',
    score: 9.5,
    initialVotes: 118,
    verified: true,
    location: 'Directly Opposite Faculty of Law, Kongo Campus',
    description:
      'Specialized legal document reproduction, Law Report binding, laminated law notes, and official student seal embosser services.',
    featuredOffer: 'Express 15-minute binding on moot court briefs and citations',
    images: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'Request Express Binding',
    actionLink: 'https://wa.me/2348055667788?text=Hello%20Kongo%20Binding,%20I%20have%20documents%20to%20print',
  },
  {
    id: 'biz-06',
    rank: 6,
    name: 'Ahmadu Bello Campus Express Delivery',
    category: 'Logistics & Courier',
    score: 9.4,
    initialVotes: 180,
    verified: true,
    location: 'Samaru Central Market Terminal',
    description:
      'Reliable intra-campus dispatch riders for parcels, textbooks, lab equipment, and urgent hostel deliveries in under 30 minutes.',
    featuredOffer: 'Flat campus delivery rate between Samaru and Kongo campuses',
    images: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'Request Dispatch Rider',
    actionLink: 'https://wa.me/2348066778899?text=Hello%20Campus%20Express,%20I%20need%20a%20dispatch%20rider',
  },
  {
    id: 'biz-07',
    rank: 7,
    name: 'Prestige Student Laundry & Dry Cleaners',
    category: 'Lifestyle & Laundry',
    score: 9.3,
    initialVotes: 134,
    verified: true,
    location: 'Suleiman Hall Walkway, Samaru',
    description:
      'Fast turnaround washing, ironing, and suit dry cleaning. Same-day emergency service available for presentations and interviews.',
    featuredOffer: 'Hostel doorstep pickup and drop-off on orders above 10 pieces',
    images: [
      'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'Book Hostel Pickup',
    actionLink: 'https://wa.me/2348077889900?text=Hi%20Prestige%20Laundry,%20pickup%20needed',
  },
  {
    id: 'biz-08',
    rank: 8,
    name: 'CampusByte Solar & Laptop Station',
    category: 'Tech & Coworking',
    score: 9.3,
    initialVotes: 160,
    verified: true,
    location: 'Ribadu Quadrangle Hub, Samaru',
    description:
      'Quiet 24/7 solar-powered study and coding lounge with fiber internet, power banks for rent, and cold beverage coolers.',
    featuredOffer: 'High-speed Wi-Fi and solar desk power at student discount rate',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'Check Desk Availability',
    actionLink: 'https://wa.me/2348088990011?text=Hello%20CampusByte,%20is%20desk%20space%20available?',
  },
  {
    id: 'biz-09',
    rank: 9,
    name: 'Amina Pharmacy & Wellness Kiosk',
    category: 'Health & Wellness',
    score: 9.2,
    initialVotes: 105,
    verified: true,
    location: 'Amina Hall Junction, Main Gate Road',
    description:
      'Registered pharmacists dispensing essential OTC medications, vitamins, sanitary supplies, and first aid kits directly to students.',
    featuredOffer: 'Free blood pressure check & certified first aid consultation',
    images: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'Inquire Availability',
    actionLink: 'https://wa.me/2348099001122?text=Hello%20Amina%20Pharmacy,%20checking%20prescription',
  },
  {
    id: 'biz-10',
    rank: 10,
    name: 'Danfodio Creative Graphics & Merch',
    category: 'Apparel & Brand Design',
    score: 9.1,
    initialVotes: 92,
    verified: true,
    location: 'Danfodio Hall Commercial Wing',
    description:
      'Screen printing, heat-press embroidery, branded departmental jerseys, event badges, and customized student club merchandise.',
    featuredOffer: 'Free custom vector logo with departmental apparel orders over 20 hoodies',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    ],
    actionLabel: 'Get Merch Quote',
    actionLink: 'https://wa.me/2348000112233?text=Hi%20Danfodio%20Graphics,%20we%20need%20departmental%20hoodies',
  },
];

/**
 * Individual Instagram-Style Carousel Post Card for a Single Business
 * - No tiny circular image: Name of business is paramount and bold.
 * - Icons attached: strictly 'VOTE' and 'SHARE'. Other icons removed.
 * - Strictly Lucide icons only, no emojis.
 */
function InstagramBusinessPostCard({
  business,
  userVotes,
  onToggleVote,
  onShare,
}: {
  business: CampusBusinessItem;
  userVotes: Record<string, boolean>;
  onToggleVote: (id: string) => void;
  onShare: (name: string, url: string) => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [showHeartOverlay, setShowHeartOverlay] = React.useState(false);
  const isVoted = !!userVotes[business.id];
  const currentVotes = business.initialVotes + (isVoted ? 1 : 0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : business.images.length - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev < business.images.length - 1 ? prev + 1 : 0));
  };

  const handleDoubleTap = () => {
    if (!isVoted) {
      onToggleVote(business.id);
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);
  };

  return (
    <article
      className="w-[310px] sm:w-[350px] md:w-[370px] shrink-0 flex flex-col justify-between h-full rounded-2xl bg-[#FFFFF0] dark:bg-surface-raised-dark border-2 border-[#E8DFD5] dark:border-border-dark shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_35px_-8px_rgba(0,0,0,0.2),0_0_24px_rgba(123,46,16,0.15)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden"
    >
      {/* 1. HEADER: PARAMOUNT BOLD BUSINESS NAME (NO TINY CIRCULAR IMAGE) */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3 border-b border-[#EAE3D9] dark:border-border-dark bg-[#FDFCF7] dark:bg-canvas-dark/40 h-[116px] sm:h-[122px]">
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div className="flex items-start gap-1.5">
            <h3 className="text-base sm:text-lg font-display font-extrabold text-[#1F1C18] dark:text-white leading-tight tracking-tight group-hover:text-brand transition-colors line-clamp-2">
              {business.name}
            </h3>
            {business.verified && (
              <CheckCircle2
                className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                strokeWidth={2.5}
                aria-label="Verified Campus Business"
              />
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted dark:text-ink-muted-dark">
            <span className="text-[#7B2E10] dark:text-brand-dark font-bold">{business.category}</span>
            <span>•</span>
            <span className="truncate">{business.location.split(',')[1]?.trim() || 'Samaru'}</span>
          </div>
        </div>

        {/* Prominent Ranking Badge (e.g. 01, 02) - All in identical neutral color without hashtag */}
        <div className="shrink-0 px-2.5 py-1 rounded-full text-xs font-mono font-bold border border-white/20 bg-[#24211D] text-white flex items-center justify-center shadow-xs">
          <span>{String(business.rank).padStart(2, '0')}</span>
        </div>
      </div>

      {/* 2. IMAGE CAROUSEL WITH MULTI-IMAGE FLIP & DOUBLE-TAP LIKE */}
      <div
        className="relative w-full aspect-square bg-stone-900 overflow-hidden cursor-pointer select-none group/media"
        onDoubleClick={handleDoubleTap}
        aria-label={`Photos of ${business.name}`}
      >
        <Image
          src={business.images[activeImageIndex]}
          alt={`${business.name} slide ${activeImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 310px, 370px"
          className="object-cover transition-transform duration-500 ease-out group-hover/media:scale-105"
        />

        {/* Carousel Slide Counter Badge (1/3) */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-white shadow-xs pointer-events-none">
          {activeImageIndex + 1}/{business.images.length}
        </div>

        {/* Rating Score Overlay Pill (Professional Trust Metric - No Star Emoji) */}
        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-emerald-300 shadow-xs flex items-center gap-1 pointer-events-none">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
          <span>{business.score}</span>
        </div>

        {/* Prev / Next Chevrons on Carousel */}
        {business.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/media:opacity-100 transition-all duration-200 hover:scale-110 shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover/media:opacity-100 transition-all duration-200 hover:scale-110 shadow-md cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Carousel Dots Indicator */}
        {business.images.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
            {business.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeImageIndex
                    ? 'w-4 bg-white shadow-xs'
                    : 'bg-white/50 backdrop-blur-xs'
                }`}
              />
            ))}
          </div>
        )}

        {/* Double-tap animated heart pop */}
        {showHeartOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-20 h-20 text-white fill-rose-500 drop-shadow-2xl animate-ping" />
          </div>
        )}
      </div>

      {/* 3. ACTION BAR: STRICTLY 'VOTE' AND 'SHARE' ICONS (OTHER ICONS REMOVED) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3.5">
        <div className="flex items-center justify-between gap-3 h-9">
          <div className="flex items-center gap-2">
            {/* VOTE BUTTON */}
            <button
              type="button"
              onClick={() => onToggleVote(business.id)}
              aria-label={isVoted ? 'Remove vote' : 'Vote for this business'}
              className={`h-9 px-3.5 sm:px-4 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand ${
                isVoted
                  ? 'bg-rose-500 text-white shadow-rose-500/25'
                  : 'bg-[#FFFFF0] dark:bg-canvas-dark border border-[#E8DFD5] dark:border-border-dark text-[#1F1C18] dark:text-white hover:text-rose-600 hover:border-rose-400'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-200 ${
                  isVoted ? 'fill-white text-white scale-110' : 'text-rose-500'
                }`}
                strokeWidth={2.2}
              />
              <span>{isVoted ? 'Voted' : 'Vote'}</span>
            </button>

            {/* SHARE BUTTON */}
            <button
              type="button"
              onClick={() => onShare(business.name, business.actionLink)}
              aria-label="Share business"
              className="h-9 px-3.5 sm:px-4 rounded-full flex items-center gap-1.5 text-xs font-bold bg-[#FFFFF0] dark:bg-canvas-dark border border-[#E8DFD5] dark:border-border-dark text-[#1F1C18] dark:text-white hover:text-brand hover:border-brand/50 transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4 text-ink-muted hover:text-brand" strokeWidth={2} />
              <span>Share</span>
            </button>
          </div>

          {/* Ranking & Votes Stats */}
          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-[#1F1C18] dark:text-white tabular-nums flex items-center justify-end gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
              <span>{currentVotes.toLocaleString()} votes</span>
            </span>
            <span className="text-[11px] font-semibold text-[#7B2E10] dark:text-brand-dark block">
              Rank {business.rank} of 10
            </span>
          </div>
        </div>

        {/* 4. BUSINESS DESCRIPTION */}
        <p className="text-xs text-[#3E3A35] dark:text-ink-muted-dark leading-relaxed line-clamp-2 h-9 overflow-hidden">
          <strong className="text-[#1F1C18] dark:text-white font-bold mr-1">
            {business.name}
          </strong>
          {business.description}
        </p>

        {/* Special Offer Sticker (Lucide Tag, no emoji) */}
        <div className="p-2.5 rounded-lg bg-[#F8F5EE] dark:bg-canvas-dark border border-[#EAE3D9] dark:border-border-dark flex items-center gap-1.5 text-[11px] text-[#7B2E10] dark:text-brand-dark font-medium leading-snug min-h-[50px] sm:min-h-[52px]">
          <Tag className="w-3.5 h-3.5 shrink-0 text-[#7B2E10] dark:text-brand-dark" />
          <span className="line-clamp-2">{business.featuredOffer}</span>
        </div>

        {/* Location line */}
        <div className="flex items-center gap-1 text-[11px] text-[#554F47] dark:text-ink-muted-dark truncate h-4">
          <MapPin className="w-3 h-3 text-[#7B2E10] dark:text-brand-dark shrink-0" />
          <span className="truncate">{business.location}</span>
        </div>

        {/* 5. CALL TO ACTION BUTTON */}
        <div className="pt-1">
          <a
            href={business.actionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#16120F] hover:bg-[#7B2E10] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-98 shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <span>{business.actionLabel}</span>
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
          </a>
        </div>
      </div>
    </article>
  );
}

/**
 * Main "Campus Businesses" Carousel Section
 * Designed to sit cleanly under the Spotlight section.
 */
export function CampusBusinessCarousel() {
  const [userVotes, setUserVotes] = React.useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  const [copyFeedback, setCopyFeedback] = React.useState<string | null>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  // Load votes from localStorage on mount
  React.useEffect(() => {
    try {
      const savedVotes = localStorage.getItem('campusly_business_votes');
      if (savedVotes) {
        setUserVotes(JSON.parse(savedVotes));
      }
    } catch {
      // Local storage unavailable in private browsing
    }
  }, []);

  const toggleVote = (id: string) => {
    setUserVotes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('campusly_business_votes', JSON.stringify(next));
      } catch {
        // silent
      }
      return next;
    });
  };

  const handleShare = (name: string, url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopyFeedback(`Link for ${name} copied!`);
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  // Filter top 10 businesses by category
  const filteredBusinesses = React.useMemo(() => {
    if (activeFilter === 'top3') {
      return TOP_CAMPUS_BUSINESSES.slice(0, 3);
    }
    if (activeFilter === 'tech') {
      return TOP_CAMPUS_BUSINESSES.filter(
        (b) => b.category.toLowerCase().includes('tech') || b.category.toLowerCase().includes('software')
      );
    }
    if (activeFilter === 'food') {
      return TOP_CAMPUS_BUSINESSES.filter((b) => b.category.toLowerCase().includes('food'));
    }
    if (activeFilter === 'services') {
      return TOP_CAMPUS_BUSINESSES.filter(
        (b) =>
          b.category.toLowerCase().includes('print') ||
          b.category.toLowerCase().includes('legal') ||
          b.category.toLowerCase().includes('laundry') ||
          b.category.toLowerCase().includes('logistics') ||
          b.category.toLowerCase().includes('apparel')
      );
    }
    return TOP_CAMPUS_BUSINESSES;
  }, [activeFilter]);

  // Horizontal scroll buttons
  const scrollTrack = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const cardWidth = 360;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section
      aria-label="Campus Businesses Ranked by Students"
      className="flex flex-col gap-4 sm:gap-5 w-full pt-4"
    >
      {/* SECTION HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#7B2E10] text-white text-[11px] font-bold tracking-wide uppercase">
              Top 10 Ranked
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-ink-dark tracking-tight">
            Campus Businesses
          </h2>

          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed font-normal">
            The top 10 student businesses working across Samaru and Kongo campuses. Swipe through verified student enterprises, see community ratings, vote for your favorites, and share directly with peers.
          </p>
        </div>

        {/* Horizontal Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scrollTrack('left')}
            className="w-10 h-10 rounded-full bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark flex items-center justify-center text-ink dark:text-ink-dark hover:text-brand hover:border-brand/60 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack('right')}
            className="w-10 h-10 rounded-full bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark flex items-center justify-center text-ink dark:text-ink-dark hover:text-brand hover:border-brand/60 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
        {[
          { key: 'all', label: 'All Top 10', icon: Store },
          { key: 'top3', label: 'Top 3 Podium', icon: Award },
          { key: 'food', label: 'Food & Bistro', icon: UtensilsCrossed },
          { key: 'tech', label: 'Tech & Gadgets', icon: Laptop },
          { key: 'services', label: 'Services & Print', icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                isActive
                  ? 'bg-brand text-white shadow-xs'
                  : 'bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-ink dark:text-ink-dark hover:text-brand hover:border-brand/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* COPY NOTIFICATION TOAST */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#16120F] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-white/20 animate-dropdown-intro">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* INSTAGRAM-STYLE POSTS HORIZONTAL CAROUSEL TRACK */}
      <div
        ref={trackRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth snap-x snap-mandatory"
      >
        {filteredBusinesses.map((biz) => (
          <div key={biz.id} className="snap-start flex flex-col h-full">
            <InstagramBusinessPostCard
              business={biz}
              userVotes={userVotes}
              onToggleVote={toggleVote}
              onShare={handleShare}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
