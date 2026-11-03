import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { formatStarCount } from '@/components/ui/star-control';
import { CATEGORY_META, CategoryKey } from '@/components/ui/chip';

describe('Design System Tokens & Base Components (BP-02)', () => {
  describe('Design Token Strictness Rule', () => {
    it('verifies that no component file contains raw hex color codes', () => {
      const componentsUiDir = path.resolve(process.cwd(), 'components/ui');
      const files = fs.readdirSync(componentsUiDir);

      const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
      const violations: { file: string; match: string }[] = [];

      for (const file of files) {
        if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
        const content = fs.readFileSync(path.join(componentsUiDir, file), 'utf-8');
        const matches = content.match(hexRegex);
        if (matches) {
          for (const m of matches) {
            violations.push({ file, match: m });
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it('verifies that no shell component contains raw hex color codes', () => {
      const componentsShellDir = path.resolve(process.cwd(), 'components/shell');
      const files = fs.readdirSync(componentsShellDir);

      const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
      const violations: { file: string; match: string }[] = [];

      for (const file of files) {
        if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
        const content = fs.readFileSync(path.join(componentsShellDir, file), 'utf-8');
        const matches = content.match(hexRegex);
        if (matches) {
          for (const m of matches) {
            violations.push({ file, match: m });
          }
        }
      }

      expect(violations).toEqual([]);
    });
  });

  describe('Star Control Logic', () => {
    it('formats star count correctly with tabular numerals and k abbreviation', () => {
      expect(formatStarCount(0)).toBe('0');
      expect(formatStarCount(42)).toBe('42');
      expect(formatStarCount(999)).toBe('999');
      expect(formatStarCount(1000)).toBe('1k');
      expect(formatStarCount(1200)).toBe('1.2k');
      expect(formatStarCount(1250)).toBe('1.3k');
      expect(formatStarCount(15000)).toBe('15k');
    });
  });

  describe('Category Definitions (D04 Tuscan Academic Heritage)', () => {
    it('has all 10 required academic and student categories', () => {
      const requiredCategories: CategoryKey[] = [
        'technology',
        'business',
        'sustainability',
        'academic',
        'leadership',
        'creative',
        'sports',
        'science',
        'health',
        'culture',
      ];

      for (const cat of requiredCategories) {
        expect(CATEGORY_META[cat]).toBeDefined();
        expect(CATEGORY_META[cat].label).toBeTruthy();
        expect(CATEGORY_META[cat].tintClass).toBeTruthy();
        expect(CATEGORY_META[cat].inkClass).toBeTruthy();
      }
    });
  });

  describe('Theme Definitions', () => {
    it('tokens.json contains all essential light and dark theme definitions', () => {
      const tokensPath = path.resolve(process.cwd(), 'tokens.json');
      expect(fs.existsSync(tokensPath)).toBe(true);

      const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
      expect(tokens.color.light).toBeDefined();
      expect(tokens.color.dark).toBeDefined();
      expect(tokens.color.categories).toBeDefined();
      expect(tokens.typography).toBeDefined();
      expect(tokens.spacing).toBeDefined();
      expect(tokens.radius).toBeDefined();
      expect(tokens.elevation).toBeDefined();
      expect(tokens.motion).toBeDefined();
      expect(tokens.breakpoints).toBeDefined();
      expect(tokens.zIndex).toBeDefined();
    });

    it('tokens.css contains :root and [data-theme=dark] blocks with focus ring', () => {
      const cssPath = path.resolve(process.cwd(), 'styles/tokens.css');
      expect(fs.existsSync(cssPath)).toBe(true);

      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      expect(cssContent).toContain(':root');
      expect(cssContent).toContain("[data-theme='dark']");
      expect(cssContent).toContain('--color-focus-ring');
      expect(cssContent).toContain('--font-family-display');
      expect(cssContent).toContain('--font-family-body');
    });
  });
});
