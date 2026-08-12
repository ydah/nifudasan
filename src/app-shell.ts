import { FONT_OPTIONS, type LabelConfig, type TextElementKey } from './config';

const renderFontOptions = (selected: LabelConfig[TextElementKey]['fontFamily']): string => FONT_OPTIONS
  .map(({ value, label }) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`)
  .join('');

const renderStepper = (key: TextElementKey, property: 'fontSize' | 'offsetX' | 'offsetY', value: number, label: string, min: number, max: number): string => `
  <div class="setting-row">
    <label for="${key}-${property}">${label}</label>
    <div class="stepper">
      <button class="step-button" type="button" data-key="${key}" data-property="${property}" data-step="-1" aria-label="${label}を1減らす">−</button>
      <input id="${key}-${property}" data-setting="${key}.${property}" type="number" min="${min}" max="${max}" step="1" value="${value}" aria-label="${label}" />
      <button class="step-button" type="button" data-key="${key}" data-property="${property}" data-step="1" aria-label="${label}を1増やす">＋</button>
    </div>
  </div>`;

const renderTextSettings = (key: TextElementKey, title: string, config: LabelConfig[TextElementKey]): string => `
  <section class="settings-group" aria-labelledby="${key}-settings-title">
    <div class="settings-group-heading">
      <span class="settings-index">0${key === 'conference' ? 1 : 2}</span>
      <h3 id="${key}-settings-title">${title}</h3>
    </div>
    <div class="setting-row">
      <label for="${key}-fontFamily">フォント</label>
      <select id="${key}-fontFamily" data-setting="${key}.fontFamily">
        ${renderFontOptions(config.fontFamily)}
      </select>
    </div>
    ${renderStepper(key, 'fontSize', config.fontSize, '文字サイズ', 10, 40)}
    ${renderStepper(key, 'offsetX', config.offsetX, '横位置', -100, 100)}
    ${renderStepper(key, 'offsetY', config.offsetY, '縦位置', -100, 100)}
  </section>`;

export const renderAppShell = (config: LabelConfig): string => `
  <div class="app-shell">
    <header class="app-header">
      <h1>荷札さん</h1>
    </header>
    <main>
      <div class="workspace-grid">
        <aside class="settings-panel" aria-label="荷札の設定">
          <form id="label-form">
            <div class="primary-fields">
              <div class="field-block">
                <label for="conference-text">カンファレンス名</label>
                <input id="conference-text" name="conference" type="text" maxlength="80" value="${config.conference.text}" autocomplete="off" />
              </div>
              <div class="field-block">
                <label for="arrival-date-text">必着日時</label>
                <input id="arrival-date-text" name="arrivalDate" type="text" maxlength="40" value="${config.arrivalDate.text}" autocomplete="off" />
              </div>
              <div class="field-block">
                <label for="max-boxes">最大箱数</label>
                <input id="max-boxes" name="maxBoxes" type="number" min="1" max="99" step="1" value="${config.maxBoxes}" inputmode="numeric" />
              </div>
            </div>

            <details id="advanced-settings" class="advanced-settings">
              <summary>
                <span class="summary-title"><span class="summary-chevron" aria-hidden="true">›</span>詳細設定</span>
                <span class="summary-note">フォント・位置を微調整</span>
              </summary>
              <div class="advanced-content">
                ${renderTextSettings('conference', 'カンファレンス名', config.conference)}
                ${renderTextSettings('arrivalDate', '必着日時', config.arrivalDate)}
                <button id="reset-layout" class="reset-button" type="button">レイアウトを初期値に戻す <span aria-hidden="true">↺</span></button>
              </div>
            </details>

            <div class="output-actions">
              <button class="export-button export-button-primary" type="button" data-export="blank">
                <strong>空欄の荷札</strong>
                <span class="button-arrow" aria-hidden="true">↗</span>
              </button>
              <button class="export-button" type="button" data-export="example">
                <strong>記入例</strong>
                <span class="button-arrow" aria-hidden="true">↗</span>
              </button>
              <p id="export-status" class="export-status" role="status" aria-live="polite"></p>
            </div>
          </form>

          <div class="privacy-note"><span class="lock-icon" aria-hidden="true">⌁</span><span>このツールはブラウザ内だけで動作します。入力内容は送信・保存されません。</span></div>
        </aside>

        <section class="preview-panel" aria-label="荷札プレビュー">
          <div class="preview-stage">
            <div id="label-preview" class="label-preview" aria-label="荷札プレビュー"></div>
          </div>
          <div class="preview-footer">
            <div class="preview-note"><span class="note-line"></span><span>外枠・説明文・記入欄は固定です</span></div>
            <div class="preview-dimensions">860 × 613 <span>／</span> 3:2.14</div>
          </div>
        </section>
      </div>
    </main>
  </div>`;
