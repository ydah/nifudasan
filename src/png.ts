import { CANVAS_HEIGHT, CANVAS_WIDTH, PNG_SCALE } from './config';

const slugify = (value: string): string => {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'shipping-label';
};

export const buildFilename = (conferenceName: string, example: boolean): string => {
  const suffix = example ? '-shipping-label-example.png' : '-shipping-label.png';
  return `${slugify(conferenceName)}${suffix}`;
};

const loadSvgImage = (svg: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const image = new Image();

  image.onload = () => {
    URL.revokeObjectURL(url);
    resolve(image);
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('荷札画像の読み込みに失敗しました。'));
  };
  image.src = url;
});

export const downloadPng = async (svg: string, filename: string): Promise<void> => {
  const image = await loadSvgImage(svg);
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH * PNG_SCALE;
  canvas.height = CANVAS_HEIGHT * PNG_SCALE;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('画像出力用のCanvasを初期化できませんでした。');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) {
    throw new Error('PNGの生成に失敗しました。');
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
