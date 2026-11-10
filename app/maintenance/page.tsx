import type { Metadata } from 'next';
import { Shield, Wrench, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'System Maintenance | Campusly ABU Zaria',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 mx-auto shadow-xs">
        <Wrench className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted">
          Scheduled Academic Registry Maintenance
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-ink-dark">
          Platform Currently Updating
        </h1>
        <p className="text-xs text-ink-muted leading-relaxed">
          The Campusly platform is undergoing routine semester database migration and maintenance.
          Registry discovery will resume shortly.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-surface-raised border border-border/80 max-w-xs text-xs font-mono text-ink-muted space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-cypress-green font-bold">
          <Clock className="w-4 h-4 animate-spin" />
          <span>Semester Maintenance Active</span>
        </div>
        <p className="text-[11px]">All student submissions and star counters are securely preserved.</p>
      </div>
    </div>
  );
}
