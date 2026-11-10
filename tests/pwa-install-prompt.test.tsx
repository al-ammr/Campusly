// @vitest-environment jsdom
import { beforeEach, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';

/**
 * Mock localStorage for opt‑out flag.
 */
beforeEach(() => {
  localStorage.clear();
});

test('renders install prompt when not opted out and not shown before', () => {
  render(<PwaInstallPrompt />);
  const prompt = screen.getByRole('dialog');
  expect(prompt).toBeTruthy();
});

test('does not render prompt when opted out', () => {
  localStorage.setItem('campuslyTelemetryOptOut', 'true');
  render(<PwaInstallPrompt />);
  const prompt = screen.queryByRole('dialog');
  expect(prompt).toBeNull();
});
