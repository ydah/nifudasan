# 荷札さん

カンファレンス搬入用の荷札を、カンファレンス名・必着日時・最大箱数の入力だけで作成できるWebアプリです。

ブラウザ内だけで動作するため、入力内容は外部へ送信・保存されません。

## できること

- 荷札のプレビューをリアルタイム表示
- 「空欄の荷札」と「記入例」をPNGでダウンロード
- カンファレンス名、必着日時、最大箱数を変更
- 詳細設定でフォント・文字サイズ・位置を調整
- 固定レイアウト（860 × 613）で出力
- 外枠の外側が透過されたPNGを生成

初期値は次のとおりです。

- カンファレンス名: `Hoge Conference`
- 必着日時: `10/15 10-14`
- 最大箱数: `10`

## 使い方

### ローカルで起動する

```bash
npm install
npm run dev
```

表示されたURLをブラウザで開き、カンファレンス名・必着日時・最大箱数を入力します。

必要に応じて「詳細設定」を開き、フォントや文字位置を調整してください。最後に「空欄の荷札」または「記入例」を押すとPNGを保存できます。

### GitHub Pagesで公開する

`.github/workflows/deploy-pages.yml` により、`main` ブランチへのpushで自動的にビルド・デプロイされます。手動実行にも対応しています。

初回だけ、GitHubリポジトリの `Settings > Pages` で公開元に `GitHub Actions` を選択してください。公開URLは、デプロイ完了後のActions画面または同じPages設定画面で確認できます。

## 開発用コマンド

```bash
# 開発サーバーを起動
npm run dev

# テストを実行
npm test

# 本番用にビルド
npm run build

# ビルド結果をローカルで確認
npm run preview
```

## CIと依存関係の更新

- `.github/workflows/ci.yml`: push・Pull Requestごとにテスト、ビルド、actionlint、zizmorを実行
- `.github/workflows/deploy-pages.yml`: GitHub Pagesへデプロイ
- `.github/dependabot.yml`: npmパッケージとGitHub Actionsを毎週更新

GitHub ActionsはSHAを固定し、CIでは権限を必要最小限に設定しています。

## ディレクトリ構成

```text
.
├── src/
│   ├── app-shell.ts  # 入力フォームと画面構成
│   ├── config.ts     # 初期値・調整範囲・出力サイズ
│   ├── main.ts       # 入力イベントと書き出し処理
│   ├── png.ts        # SVGからPNGを生成
│   ├── renderer.ts   # 荷札SVGを生成
│   ├── sample.ts     # 記入例の値
│   ├── styles.css    # 画面スタイル
│   └── template.ts   # 荷札の固定レイアウト
├── tests/            # renderer・PNG出力のテスト
└── .github/
    ├── dependabot.yml
    └── workflows/    # CI・GitHub Pagesデプロイ
```
