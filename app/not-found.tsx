import { EmptyState } from '@/components/ui/empty-state';
import { t } from '@/lib/copy/strings';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
      <EmptyState
        title={t('state.not_available.title')}
        description={t('state.not_available.description')}
        actionLabel={t('state.not_available.action')}
        actionHref="/"
      />
    </div>
  );
}
