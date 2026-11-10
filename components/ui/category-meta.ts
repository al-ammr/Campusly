import {
  Cpu,
  Briefcase,
  Leaf,
  GraduationCap,
  HeartHandshake,
  Palette,
  Trophy,
  FlaskConical,
  Activity,
  Users,
  LucideIcon,
} from 'lucide-react';

export type CategoryKey =
  | 'technology'
  | 'business'
  | 'sustainability'
  | 'academic'
  | 'leadership'
  | 'creative'
  | 'sports'
  | 'science'
  | 'health'
  | 'culture';

export const CATEGORY_ICONS: Record<CategoryKey, LucideIcon> = {
  technology: Cpu,
  business: Briefcase,
  sustainability: Leaf,
  academic: GraduationCap,
  leadership: HeartHandshake,
  creative: Palette,
  sports: Trophy,
  science: FlaskConical,
  health: Activity,
  culture: Users,
};

export const CATEGORY_META: Record<
  CategoryKey,
  { label: string; tintClass: string; inkClass: string; darkBgClass: string }
> = {
  technology: {
    label: 'Technology & Digital Skills',
    tintClass: 'bg-cat-tech-tint dark:bg-cat-tech-darkBg',
    inkClass: 'text-cat-tech-ink dark:text-cat-tech-tint',
    darkBgClass: 'bg-cat-tech-darkBg',
  },
  business: {
    label: 'Entrepreneurship & Business',
    tintClass: 'bg-cat-business-tint dark:bg-cat-business-darkBg',
    inkClass: 'text-cat-business-ink dark:text-cat-business-tint',
    darkBgClass: 'bg-cat-business-darkBg',
  },
  sustainability: {
    label: 'Sustainability & Environment',
    tintClass: 'bg-cat-sustain-tint dark:bg-cat-sustain-darkBg',
    inkClass: 'text-cat-sustain-ink dark:text-cat-sustain-tint',
    darkBgClass: 'bg-cat-sustain-darkBg',
  },
  academic: {
    label: 'Academic & Professional Development',
    tintClass: 'bg-cat-academic-tint dark:bg-cat-academic-darkBg',
    inkClass: 'text-cat-academic-ink dark:text-cat-academic-tint',
    darkBgClass: 'bg-cat-academic-darkBg',
  },
  leadership: {
    label: 'Leadership & Volunteering',
    tintClass: 'bg-cat-lead-tint dark:bg-cat-lead-darkBg',
    inkClass: 'text-cat-lead-ink dark:text-cat-lead-tint',
    darkBgClass: 'bg-cat-lead-darkBg',
  },
  creative: {
    label: 'Creative Arts & Media',
    tintClass: 'bg-cat-creative-tint dark:bg-cat-creative-darkBg',
    inkClass: 'text-cat-creative-ink dark:text-cat-creative-tint',
    darkBgClass: 'bg-cat-creative-darkBg',
  },
  sports: {
    label: 'Sports & Recreation',
    tintClass: 'bg-cat-sports-tint dark:bg-cat-sports-darkBg',
    inkClass: 'text-cat-sports-ink dark:text-cat-sports-tint',
    darkBgClass: 'bg-cat-sports-darkBg',
  },
  science: {
    label: 'Science & Research',
    tintClass: 'bg-cat-science-tint dark:bg-cat-science-darkBg',
    inkClass: 'text-cat-science-ink dark:text-cat-science-tint',
    darkBgClass: 'bg-cat-science-darkBg',
  },
  health: {
    label: 'Health & Wellbeing',
    tintClass: 'bg-cat-health-tint dark:bg-cat-health-darkBg',
    inkClass: 'text-cat-health-ink dark:text-cat-health-tint',
    darkBgClass: 'bg-cat-health-darkBg',
  },
  culture: {
    label: 'Culture & Community',
    tintClass: 'bg-cat-culture-tint dark:bg-cat-culture-darkBg',
    inkClass: 'text-cat-culture-ink dark:text-cat-culture-tint',
    darkBgClass: 'bg-cat-culture-darkBg',
  },
};

export function resolveCategoryKey(input?: string): CategoryKey {
  if (!input) return 'academic';
  const s = input.toLowerCase();
  if (s.includes('tech') || s.includes('cpu') || s.includes('digital')) return 'technology';
  if (s.includes('busin') || s.includes('entrepr')) return 'business';
  if (s.includes('sustain') || s.includes('environ') || s.includes('leaf')) return 'sustainability';
  if (s.includes('acad') || s.includes('profess') || s.includes('grad')) return 'academic';
  if (s.includes('lead') || s.includes('volunt')) return 'leadership';
  if (s.includes('creat') || s.includes('art') || s.includes('media') || s.includes('palette')) return 'creative';
  if (s.includes('sport') || s.includes('recreat') || s.includes('trophy')) return 'sports';
  if (s.includes('scien') || s.includes('research') || s.includes('flask')) return 'science';
  if (s.includes('health') || s.includes('well') || s.includes('pulse') || s.includes('medic')) return 'health';
  if (s.includes('cultur') || s.includes('commun') || s.includes('users')) return 'culture';
  return 'academic';
}
