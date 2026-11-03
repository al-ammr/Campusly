import * as React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      aria-hidden="true"
      className={`
        bg-stone dark:bg-stone-dark rounded
        animate-pulse motion-reduce:animate-none
        ${className}
      `}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC<{ aspectRatio?: '16:9' | '1:1'; className?: string }> = ({
  aspectRatio = '16:9',
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark overflow-hidden flex flex-col p-0 ${className}`}
    >
      <Skeleton className={`w-full ${aspectRatio === '1:1' ? 'aspect-square' : 'aspect-video'} rounded-none`} />
      <div className="p-4 flex flex-col gap-2.5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
};
