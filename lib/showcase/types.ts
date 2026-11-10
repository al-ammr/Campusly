/**
 * Campusly Showcase & Exploration Categories Specification
 * Architecture & Types for Home Showcase, Gallery, Top 10 Businesses & Admin Control
 */

export interface ShowcaseCategory {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string; // lucide icon identifier e.g. 'Grid' | 'Users' | 'Calendar' | 'Briefcase' | 'Store'
  badge?: string;
  href: string; // Destination URL (e.g., /categories, /communities, /events, /opportunities, /businesses)
  featuredCount?: string;
  accentColor?: string;
}

export interface ShowcaseFeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface ShowcaseIntro {
  title: string;
  subtitle: string;
  body: string;
  features: ShowcaseFeatureItem[];
}

export interface ShowcaseGalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  categoryTag: string; // 'categories' | 'communities' | 'events' | 'opportunities' | 'businesses' | 'general'
  order: number;
}

export interface ShowcaseCta {
  label: string;
  href: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface BusinessActionButton {
  label: string; // e.g. "View Store", "Contact on WhatsApp", "Order Now"
  link: string; // Direct URL, tel:, mailto:, or WhatsApp link
  behavior: '_self' | '_blank';
}

export interface TopBusinessItem {
  id: string;
  rank: number; // 1 to 10
  name: string;
  category: string;
  score: number; // e.g. 9.8 / 10
  scoreMax?: number;
  reviewCount?: number;
  verified: boolean;
  featuredOffer?: string;
  location: string;
  description: string;
  logoUrl?: string;
  actionButton: BusinessActionButton;
}

export interface ShowcaseBundle {
  categories: ShowcaseCategory[];
  intro: ShowcaseIntro;
  gallery: ShowcaseGalleryItem[];
  cta: ShowcaseCta;
  topBusinesses: TopBusinessItem[];
  updatedAt?: string;
}
