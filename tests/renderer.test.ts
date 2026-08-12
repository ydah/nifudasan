import { describe, expect, it } from 'vitest';
import { createDefaultConfig, normalizeConfig } from '../src/config';
import { renderLabel } from '../src/renderer';

describe('renderLabel', () => {
  it('renders the fixed 860 × 613 canvas', () => {
    const svg = renderLabel(createDefaultConfig());

    expect(svg).toContain('width="860" height="613" viewBox="0 0 860 613"');
    expect(svg).not.toContain('<rect width="860" height="613" fill="#ffffff"/>');
    expect(svg).toContain('担当者連絡先');
    expect(svg).toContain('企業名（ブース番号）');
    expect(svg).toContain('総個数（MAX10箱）');
    expect(svg).not.toContain('SHIPPING LABEL / CONFERENCE DELIVERY');
    expect(svg).not.toContain('stroke-dasharray');
    expect(svg).toContain('M 612 220 L 768 115');
    expect(svg).toContain('<text x="361" y="124" font-family="sans-serif" font-size="15" fill="#222222"><tspan x="361" dy="0">1. 必ず伝票とは別に荷札を</tspan><tspan x="370" dy="18">   貼り付けてください</tspan><tspan x="361" dy="20">2. 日中連絡の付く連絡先を</tspan><tspan x="370" dy="18">   記入してください</tspan></text>');
  });

  it('renders a custom maximum box count', () => {
    const config = createDefaultConfig();
    config.maxBoxes = 20;

    expect(renderLabel(config)).toContain('総個数（MAX20箱）');
  });

  it('keeps the blank version free of sample values', () => {
    const svg = renderLabel(createDefaultConfig());

    expect(svg).not.toContain('090-1234-5678');
    expect(svg).not.toContain('株式会社サンプル');
    expect(svg).not.toContain('記入例');
  });

  it('adds fixed sample values only to the example version', () => {
    const svg = renderLabel(createDefaultConfig(), { example: true });

    expect(svg).toContain('090-1234-5678');
    expect(svg).toContain('株式会社サンプル');
    expect(svg).toContain('ブース A-01');
    expect(svg).toContain('>3</text>');
    expect(svg).toContain('x="640" y="166"');
    expect(svg).toContain('x="738" y="200"');
    expect(svg.match(/x="(?:640|738)" y="(?:166|200)"[^>]+font-size="24" font-weight="700" fill="#d3483f"/g)).toHaveLength(2);
    expect(svg.match(/fill="#d3483f"/g)).toHaveLength(5);
    expect(svg).toContain('※ 記入例');
  });
});

describe('label configuration', () => {
  it('normalizes text and clamps adjustable values', () => {
    const config = createDefaultConfig();
    config.conference.text = '  2026  ';
    config.conference.fontSize = 999;
    config.conference.offsetX = -999;
    config.arrivalDate.fontSize = 1;
    config.arrivalDate.offsetY = 999;

    const normalized = normalizeConfig(config);

    expect(normalized.conference.text).toBe('2026');
    expect(normalized.conference.fontSize).toBe(40);
    expect(normalized.conference.offsetX).toBe(-100);
    expect(normalized.arrivalDate.fontSize).toBe(10);
    expect(normalized.arrivalDate.offsetY).toBe(100);
  });

});
