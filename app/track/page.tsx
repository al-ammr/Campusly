'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function TrackPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [code, setCode] = React.useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode.startsWith('CY-') || cleanCode.length < 10) {
      showToast({
        type: 'error',
        message: 'Please enter a valid tracking code in CY-XXXX-XXXX format.',
      });
      return;
    }

    router.push(`/track/${cleanCode}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display font-bold text-3xl text-ink dark:text-ink-dark">
          Track Your Submission
        </h1>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          Enter the tracking code issued when you submitted your community, event, or opportunity.
        </p>
      </div>

      <form onSubmit={handleTrack} className="flex flex-col gap-4 mt-2">
        <TextField
          label="Tracking Code"
          placeholder="CY-7K3M-9QXP"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          helperText="Format: CY-XXXX-XXXX (issued upon submission)"
          required
        />
        <Button variant="primary" type="submit" className="w-full py-3">
          Check status &rarr;
        </Button>
      </form>
    </div>
  );
}
