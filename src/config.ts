export const CANVAS_WIDTH = 860;
export const CANVAS_HEIGHT = 613;
export const PNG_SCALE = 3;

export type FontFamily = 'sans-serif' | 'serif' | 'gothic' | 'mincho' | 'monospace';
export type TextElementKey = 'conference' | 'arrivalDate';

export type TextElementConfig = {
  text: string;
  fontFamily: FontFamily;
  fontSize: number;
  offsetX: number;
  offsetY: number;
};

export type LabelConfig = {
  conference: TextElementConfig;
  arrivalDate: TextElementConfig;
  maxBoxes: number;
};

export const FONT_OPTIONS: ReadonlyArray<{ value: FontFamily; label: string; stack: string }> = [
  { value: 'sans-serif', label: 'Sans Serif', stack: 'Arial, "Helvetica Neue", "Hiragino Sans", "Yu Gothic", Meiryo, sans-serif' },
  { value: 'serif', label: 'Serif', stack: 'Georgia, "Times New Roman", "Hiragino Mincho ProN", "Yu Mincho", serif' },
  { value: 'gothic', label: 'Gothic', stack: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", Meiryo, sans-serif' },
  { value: 'mincho', label: 'Mincho', stack: '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif' },
  { value: 'monospace', label: 'Monospace', stack: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
];

export const FONT_STACKS: Record<FontFamily, string> = Object.fromEntries(
  FONT_OPTIONS.map(({ value, stack }) => [value, stack]),
) as Record<FontFamily, string>;

export const FONT_SIZE_MIN = 10;
export const FONT_SIZE_MAX = 40;
export const OFFSET_MIN = -100;
export const OFFSET_MAX = 100;
export const MAX_BOXES_MIN = 1;
export const MAX_BOXES_MAX = 99;

export const defaultConfig: LabelConfig = {
  conference: {
    text: 'Hoge Conference',
    fontFamily: 'sans-serif',
    fontSize: 20,
    offsetX: 0,
    offsetY: 0,
  },
  arrivalDate: {
    text: '01/01 10-12',
    fontFamily: 'sans-serif',
    fontSize: 20,
    offsetX: 0,
    offsetY: 0,
  },
  maxBoxes: 10,
};

export const createDefaultConfig = (): LabelConfig => structuredClone(defaultConfig);

export const clamp = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const normalizeTextElement = (element: TextElementConfig): TextElementConfig => ({
  ...element,
  text: element.text.trim(),
  fontSize: clamp(Math.round(element.fontSize), FONT_SIZE_MIN, FONT_SIZE_MAX),
  offsetX: clamp(Math.round(element.offsetX), OFFSET_MIN, OFFSET_MAX),
  offsetY: clamp(Math.round(element.offsetY), OFFSET_MIN, OFFSET_MAX),
});

export const normalizeConfig = (config: LabelConfig): LabelConfig => ({
  conference: normalizeTextElement(config.conference),
  arrivalDate: normalizeTextElement(config.arrivalDate),
  maxBoxes: clamp(Math.round(config.maxBoxes), MAX_BOXES_MIN, MAX_BOXES_MAX),
});
