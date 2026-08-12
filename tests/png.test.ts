import { describe, expect, it } from 'vitest';
import { buildFilename } from '../src/png';

describe('buildFilename', () => {
  it('creates a predictable filename for an English conference name', () => {
    expect(buildFilename('Hoge Conference 2026', false)).toBe('hoge-conference-2026-shipping-label.png');
    expect(buildFilename('Hoge Conference 2026', true)).toBe('hoge-conference-2026-shipping-label-example.png');
  });

  it('falls back to a safe filename when the name has no latin characters', () => {
    expect(buildFilename('荷札 2026', false)).toBe('2026-shipping-label.png');
    expect(buildFilename('荷札', true)).toBe('shipping-label-shipping-label-example.png');
  });
});
