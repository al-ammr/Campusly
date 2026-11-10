// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import PrivacyPolicyPage from '../../app/privacy/page';
import TermsOfServicePage from '../../app/terms/page';
import LicencesPage from '../../app/licences/page';
import ContentStandardsPage from '../../app/legal/content-standards/page';
import SpotlightTermsPage from '../../app/legal/spotlight-terms/page';
import AccessibilityStatementPage from '../../app/accessibility/page';

describe('Legal & compliance pages accessibility', () => {
  const pages = [
    { Component: PrivacyPolicyPage, name: 'Privacy Policy' },
    { Component: TermsOfServicePage, name: 'Terms of Service' },
    { Component: LicencesPage, name: 'Open Source Licences' },
    { Component: ContentStandardsPage, name: 'Content Standards' },
    { Component: SpotlightTermsPage, name: 'Spotlight Terms' },
    { Component: AccessibilityStatementPage, name: 'Accessibility Statement' },
  ];

  pages.forEach(({ Component, name }) => {
    test(`${name} should have no WCAG violations`, async () => {
      const { container } = render(<Component />);
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });
  });
});
