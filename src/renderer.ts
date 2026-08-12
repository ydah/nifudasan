import { FONT_STACKS, type LabelConfig } from './config';
import { sampleData } from './sample';
import { fixedText, templateLayout } from './template';

type RenderOptions = {
  example: boolean;
};

const escapeXml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const text = (content: string, attributes: string): string => `<text ${attributes}>${escapeXml(content)}</text>`;

const multilineText = (lines: readonly string[], x: number, y: number, lineHeight: number, attributes: string): string => (
  `<text x="${x}" y="${y}" ${attributes}>${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`).join('')}</text>`
);

type PositionedLine = {
  content: string;
  x: number;
  dy: number;
};

const positionedMultilineText = (lines: readonly PositionedLine[], y: number, attributes: string): string => {
  const [firstLine, ...remainingLines] = lines;
  if (!firstLine) return '';

  return `<text x="${firstLine.x}" y="${y}" ${attributes}>${[
    firstLine,
    ...remainingLines,
  ].map((line) => `<tspan x="${line.x}" dy="${line.dy}">${escapeXml(line.content)}</tspan>`).join('')}</text>`;
};

const SAMPLE_TEXT_COLOR = '#d3483f';

const fixedLayout = (config: LabelConfig): string => `
  <rect x="25" y="25" width="810" height="563" rx="13" fill="#ffffff" stroke="#111111" stroke-width="3"/>
  <line x1="44" y1="316" x2="816" y2="316" stroke="#111111" stroke-width="2"/>

  <rect x="65" y="69" width="266" height="216" rx="6" fill="#fafafa" stroke="#111111" stroke-width="1.5"/>
  <rect x="347" y="69" width="220" height="216" rx="6" fill="#f4f4f1" stroke="#111111" stroke-width="1.5"/>
  <rect x="583" y="69" width="212" height="216" rx="6" fill="#fafafa" stroke="#111111" stroke-width="1.5"/>

  ${text(fixedText.contactTitle, 'x="84" y="103" font-family="sans-serif" font-size="18" font-weight="700" fill="#111111"')}
  ${text(fixedText.contactHint, 'x="84" y="128" font-family="sans-serif" font-size="12" fill="#454545"')}

  ${text(fixedText.notesTitle, 'x="367" y="103" font-family="sans-serif" font-size="18" font-weight="700" fill="#111111"')}
  ${positionedMultilineText([
    { content: fixedText.notes[0], x: 361, dy: 0 },
    { content: fixedText.notes[1], x: 370, dy: 18 },
    { content: fixedText.notes[2], x: 361, dy: 20 },
    { content: fixedText.notes[3], x: 370, dy: 18 },
  ], 124, 'font-family="sans-serif" font-size="15" fill="#222222"')}

  ${text(fixedText.boxTitle, 'x="689" y="104" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#111111"')}
  <path d="M 612 220 L 768 115" fill="none" stroke="#111111" stroke-width="2"/>
  ${text(`総個数（MAX${config.maxBoxes}箱）`, 'x="689" y="236" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#222222"')}

  <text x="82" y="338" font-family="sans-serif" font-size="21" font-weight="700" fill="#111111">${escapeXml(fixedText.companyTitle)}</text>
`;

const variableLayout = (config: LabelConfig): string => {
  const conference = config.conference;
  const arrivalDate = config.arrivalDate;
  const conferencePosition = templateLayout.conferenceNamePosition;
  const arrivalDatePosition = templateLayout.arrivalDatePosition;

  return `
    ${text(conference.text, `data-variable="conference" x="${conferencePosition.x + conference.offsetX}" y="${conferencePosition.y + conference.offsetY}" text-anchor="middle" font-family='${FONT_STACKS[conference.fontFamily]}' font-size="${conference.fontSize}" font-weight="700" fill="#111111"`)}
    <rect x="359" y="210" width="196" height="60" rx="4" fill="#111111"/>
    ${multilineText(fixedText.arrivalLabel, 378, 234, 21, 'font-family="sans-serif" font-size="14" font-weight="700" fill="#ffffff"')}
    ${text(arrivalDate.text, `data-variable="arrivalDate" x="${arrivalDatePosition.x + arrivalDate.offsetX}" y="${arrivalDatePosition.y + arrivalDate.offsetY}" text-anchor="middle" font-family='${FONT_STACKS[arrivalDate.fontFamily]}' font-size="${arrivalDate.fontSize}" font-weight="700" fill="#ffffff"`)}
  `;
};

const exampleLayout = (): string => `
  ${text(sampleData.phoneNumber, `x="198" y="194" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="${SAMPLE_TEXT_COLOR}"`)}
  ${text(sampleData.boxNumber, `x="640" y="166" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="700" fill="${SAMPLE_TEXT_COLOR}"`)}
  ${text(sampleData.totalBoxes, `x="738" y="200" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="700" fill="${SAMPLE_TEXT_COLOR}"`)}
  ${text(`${sampleData.companyName}（ブース ${sampleData.boothNumber}）`, `x="82" y="410" font-family="sans-serif" font-size="24" font-weight="700" fill="${SAMPLE_TEXT_COLOR}"`)}
  <rect x="730" y="530" width="66" height="24" rx="3" fill="#e7b74d"/>
  ${text('※ 記入例', `x="763" y="547" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="${SAMPLE_TEXT_COLOR}"`)}
`;

export const renderLabel = (config: LabelConfig, options: RenderOptions = { example: false }): string => `
<svg xmlns="http://www.w3.org/2000/svg" width="860" height="613" viewBox="0 0 860 613" role="img" aria-label="${options.example ? '記入例の荷札' : '空欄の荷札'}">
  ${fixedLayout(config)}
  ${variableLayout(config)}
  ${options.example ? exampleLayout() : ''}
</svg>`.trim();
