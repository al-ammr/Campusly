'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Search,
  Bell,
  Info,
  Mail,
  FileText,
  Shield,
  Code2,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { BottomSheet } from '../ui/bottom-sheet';
import { useTheme } from '@/lib/theme/theme-provider';

export interface MoreMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const MoreMenuSheet: React.FC<MoreMenuSheetProps> = ({
  isOpen,
  onClose,
  triggerRef,
}) => {
  const { theme, setTheme } = useTheme();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Menu"
      description="Quick actions, guidelines, and preferences"
      triggerRef={triggerRef}
    >
      <div className="flex flex-col gap-6 py-2">
        {/* Core Actions */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark px-2 mb-1">
            Actions
          </span>

          <Link
            href="/submit"
            onClick={handleLinkClick}
            className="flex items-center gap-3.5 px-3 py-3 rounded-lg hover:bg-stone/60 dark:hover:bg-stone-dark/60 text-ink dark:text-ink-dark transition-colors duration-fast focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
          >
            <div className="w-9 h-9 rounded-md bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark shrink-0">
              <PlusCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Submit a listing</span>
              <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                Add a community, event or opportunity
              </span>
            </div>
          </Link>

          <Link
            href="/track"
            onClick={handleLinkClick}
            className="flex items-center gap-3.5 px-3 py-3 rounded-lg hover:bg-stone/60 dark:hover:bg-stone-dark/60 text-ink dark:text-ink-dark transition-colors duration-fast focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
          >
            <div className="w-9 h-9 rounded-md bg-info/10 dark:bg-info-dark/15 flex items-center justify-center text-info dark:text-info-dark shrink-0">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Track submission</span>
              <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                Check status with your CY-XXXX code
              </span>
            </div>
          </Link>

          <Link
            href="/announcements"
            onClick={handleLinkClick}
            className="flex items-center gap-3.5 px-3 py-3 rounded-lg hover:bg-stone/60 dark:hover:bg-stone-dark/60 text-ink dark:text-ink-dark transition-colors duration-fast focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
          >
            <div className="w-9 h-9 rounded-md bg-secondary/10 dark:bg-secondary-dark/20 flex items-center justify-center text-secondary dark:text-secondary-dark shrink-0">
              <Bell className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Announcements</span>
              <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                Official notices and campus updates
              </span>
            </div>
          </Link>
        </div>

        {/* Theme Preference */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border/50 dark:border-border-dark/50">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark px-2">
            Theme preference
          </span>

          <div className="grid grid-cols-3 gap-2 px-1">
            <button
              type="button"
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
              className={`
                h-11 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold border transition-colors duration-fast
                focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing
                ${
                  theme === 'light'
                    ? 'bg-brand dark:bg-brand-dark text-surface dark:text-ink border-brand dark:border-brand-dark'
                    : 'bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-ink dark:text-ink-dark hover:border-brand'
                }
              `}
            >
              <Sun className="w-4 h-4" aria-hidden="true" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
              className={`
                h-11 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold border transition-colors duration-fast
                focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing
                ${
                  theme === 'dark'
                    ? 'bg-brand dark:bg-brand-dark text-surface dark:text-ink border-brand dark:border-brand-dark'
                    : 'bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-ink dark:text-ink-dark hover:border-brand'
                }
              `}
            >
              <Moon className="w-4 h-4" aria-hidden="true" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              aria-pressed={theme === 'system'}
              className={`
                h-11 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold border transition-colors duration-fast
                focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing
                ${
                  theme === 'system'
                    ? 'bg-brand dark:bg-brand-dark text-surface dark:text-ink border-brand dark:border-brand-dark'
                    : 'bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-ink dark:text-ink-dark hover:border-brand'
                }
              `}
            >
              <Monitor className="w-4 h-4" aria-hidden="true" />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* Static & Legal Links */}
        <div className="flex flex-col gap-1 pt-2 border-t border-border/50 dark:border-border-dark/50">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark px-2 mb-1">
            Information
          </span>

          <div className="grid grid-cols-2 gap-1">
            <Link
              href="/about"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-stone/60 dark:hover:bg-stone-dark/60 text-ink dark:text-ink-dark text-xs font-medium focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
            >
              <Info className="w-4 h-4 text-ink-muted" aria-hidden="true" />
              <span>About Campusly</span>
            </Link>

            <Link
              href="/contact"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-stone/60 dark:hover:bg-stone-dark/60 text-ink dark:text-ink-dark text-xs font-medium focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
            >
              <Mail className="w-4 h-4 text-ink-muted" aria-hidden="true" />
              <span>Contact us</span>
            </Link>

            <Link
              href="/terms"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-stone/60 dark:hover:bg-stone-dark/60 text-ink dark:text-ink-dark text-xs font-medium focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
            >
              <FileText className="w-4 h-4 text-ink-muted" aria-hidden="true" />
              <span>Terms of use</span>
            </Link>

            <Link
              href="/privacy"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-stone/60 dark:hover:bg-stone-dark/60 text-ink dark:text-ink-dark text-xs font-medium focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
            >
              <Shield className="w-4 h-4 text-ink-muted" aria-hidden="true" />
              <span>Privacy notice</span>
            </Link>

            <Link
              href="/licences"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-stone/60 dark:hover:bg-stone-dark/60 text-ink dark:text-ink-dark text-xs font-medium focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
            >
              <Code2 className="w-4 h-4 text-ink-muted" aria-hidden="true" />
              <span>Licences</span>
            </Link>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
