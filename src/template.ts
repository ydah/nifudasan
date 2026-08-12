import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config';

export const templateLayout = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  conferenceNamePosition: { x: 452, y: 206 },
  arrivalDatePosition: { x: 476, y: 247 },
} as const;

export const fixedText = {
  contactTitle: '担当者連絡先',
  contactHint: '日中連絡の付く電話番号',
  notesTitle: '留意事項',
  notes: ['1. 必ず伝票とは別に荷札を', '   貼り付けてください', '2. 日中連絡の付く連絡先を', '   記入してください'],
  boxTitle: '箱目',
  totalBoxes: '総個数（MAX10箱）',
  companyTitle: '企業名（ブース番号）',
  arrivalLabel: ['必着', '日時'],
} as const;
