import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  MAX_BOXES_MAX,
  MAX_BOXES_MIN,
  OFFSET_MAX,
  OFFSET_MIN,
  createDefaultConfig,
  normalizeConfig,
  type FontFamily,
  type TextElementKey,
} from './config';
import { renderAppShell } from './app-shell';
import { buildFilename, downloadPng } from './png';
import { renderLabel } from './renderer';
import './styles.css';

type AdjustableProperty = 'fontFamily' | 'fontSize' | 'offsetX' | 'offsetY';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('アプリのマウント先が見つかりません。');

let config = createDefaultConfig();
app.innerHTML = renderAppShell(config);

const query = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`要素が見つかりません: ${selector}`);
  return element;
};

const setConfigProperty = (key: TextElementKey, property: AdjustableProperty, value: string): void => {
  if (property === 'fontFamily') {
    config[key].fontFamily = value as FontFamily;
    return;
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return;
  config[key][property] = numericValue;
};

const syncSettingInputs = (): void => {
  document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-setting]').forEach((input) => {
    const [key, property] = input.dataset.setting?.split('.') ?? [];
    if (!key || !property) return;
    input.value = String(config[key as TextElementKey][property as AdjustableProperty]);
  });
};

const renderPreview = (): void => {
  const preview = query<HTMLDivElement>('#label-preview');
  preview.innerHTML = renderLabel(config);
  syncSettingInputs();
};

const updateConfig = (key: TextElementKey, property: AdjustableProperty, value: string): void => {
  setConfigProperty(key, property, value);
  config = normalizeConfig(config);
  renderPreview();
};

const setExportState = (message: string, isError = false): void => {
  const status = query<HTMLParagraphElement>('#export-status');
  status.textContent = message;
  status.classList.toggle('is-error', isError);
};

const exportLabel = async (example: boolean, button: HTMLButtonElement): Promise<void> => {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-export]'));
  buttons.forEach((exportButton) => { exportButton.disabled = true; });
  button.classList.add('is-loading');
  setExportState('PNGを生成しています…');

  try {
    const svg = renderLabel(config, { example });
    await downloadPng(svg, buildFilename(config.conference.text, example));
    setExportState(example ? '記入例を保存しました。' : '空欄の荷札を保存しました。');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '画像の保存に失敗しました。';
    setExportState(message, true);
  } finally {
    buttons.forEach((exportButton) => { exportButton.disabled = false; });
    button.classList.remove('is-loading');
  }
};

query<HTMLFormElement>('#label-form').addEventListener('submit', (event) => {
  event.preventDefault();
});

query<HTMLInputElement>('#conference-text').addEventListener('input', (event) => {
  const input = event.currentTarget as HTMLInputElement;
  config.conference.text = input.value;
  renderPreview();
});

query<HTMLInputElement>('#arrival-date-text').addEventListener('input', (event) => {
  const input = event.currentTarget as HTMLInputElement;
  config.arrivalDate.text = input.value;
  renderPreview();
});

query<HTMLInputElement>('#max-boxes').addEventListener('input', (event) => {
  const input = event.currentTarget as HTMLInputElement;
  const value = Number(input.value);
  if (!Number.isFinite(value)) return;
  config.maxBoxes = Math.min(Math.max(Math.round(value), MAX_BOXES_MIN), MAX_BOXES_MAX);
  input.value = String(config.maxBoxes);
  renderPreview();
});

query<HTMLElement>('#advanced-settings').addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  const [key, property] = target.dataset.setting?.split('.') ?? [];
  if (!key || !property) return;
  updateConfig(key as TextElementKey, property as AdjustableProperty, target.value);
});

query<HTMLElement>('#advanced-settings').addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.step-button');
  if (!button) return;

  const key = button.dataset.key as TextElementKey | undefined;
  const property = button.dataset.property as AdjustableProperty | undefined;
  const step = Number(button.dataset.step);
  if (!key || !property || !Number.isFinite(step)) return;

  const currentValue = Number(config[key][property]);
  const min = property === 'fontSize' ? FONT_SIZE_MIN : OFFSET_MIN;
  const max = property === 'fontSize' ? FONT_SIZE_MAX : OFFSET_MAX;
  updateConfig(key, property, String(Math.min(Math.max(currentValue + step, min), max)));
});

query<HTMLButtonElement>('#reset-layout').addEventListener('click', () => {
  const defaults = createDefaultConfig();
  config.conference = { ...config.conference, ...defaults.conference, text: config.conference.text };
  config.arrivalDate = { ...config.arrivalDate, ...defaults.arrivalDate, text: config.arrivalDate.text };
  renderPreview();
});

document.querySelectorAll<HTMLButtonElement>('[data-export]').forEach((button) => {
  button.addEventListener('click', () => exportLabel(button.dataset.export === 'example', button));
});

renderPreview();
