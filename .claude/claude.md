# Life in Aichi — プロジェクトルール

## プロジェクト概要
愛知県在住外国人向けの給付・支援制度ナビサイト。
Next.js 14 (App Router) + TypeScript + Vercel。
4言語対応: English / Tiếng Việt / Filipino / 日本語

## ディレクトリ構成
```
src/data/articles.ts   — 全記事データ（単一ソース）
src/lib/translations.ts — UI翻訳文字列
src/lib/i18n.ts         — 言語設定
config/sources.json     — 巡回対象サイト設定
data/candidates/        — 巡回で検出された候補JSON
data/snapshots/         — 巡回スナップショット
```

## 記事データの追加手順

### 1. 記事データの追加先
- `src/data/articles.ts` の `BASE_ARTICLES` 配列に英語版を追加
- `LOCALIZED.ja` に日本語版を追加
- `LOCALIZED.vi` にベトナム語版を追加
- `LOCALIZED.tl` にタガログ語版を追加

### 2. 記事の必須フィールド
```typescript
{
  id: string,        // slug形式（英小文字・ハイフン）例: "jidou-teate"
  cat: Category,     // "childcare" | "medical" | "housing" | "work"
  title: string,     // 英語タイトル + 日本語名 例: "Child Allowance (児童手当)"
  badge: "new" | "popular" | null,
  region: string,    // "All of Japan" | "All of Aichi" | "Nagoya / Aichi" など
  summary: string,   // カード表示用の1行要約 例: "Up to ¥15,000/month per child"
  sections: {
    s1: string,   // この制度は何か
    s2: string,   // 外国籍でも対象か（冒頭に Yes/No を明記）
    s2note?: string, // 在留資格条件などの注意事項
    s3: string,   // どんな人が対象か
    s4: string,   // いくら受け取れるか
    s5: string,   // どこで申請するか
    s6: string,   // 必要書類（箇条書き）
    s7: string,   // よくあるつまずき（箇条書き）
    s8: string,   // 公式ページURL（https必須）
    s9: string,   // 最終確認日（YYYY-MM-DD形式）
    s10: string,  // 困ったときの相談先（電話番号含む）
  }
}
```

### 3. 必須バリデーション
- `s8` (公式URL) は有効なhttps URLであること
- `s9` (最終確認日) はYYYY-MM-DD形式であること
- `id` は既存記事と重複しないこと
- `cat` は "childcare" | "medical" | "housing" | "work" のいずれか
- 全4言語のローカライズを追加すること

### 4. カテゴリとCTA対応
| カテゴリ | CTA | 色 |
|---------|-----|-----|
| childcare | SIM比較 | #D46B9E (ローズピンク) |
| medical | 送金比較 | #4A9BD9 (ブルー) |
| housing | 住居サポート | #6BBF6B (グリーン) |
| work | 就活サポート | #D4A843 (ゴールド) |

### 5. 翻訳ルール
- 固有名詞（役所名、制度名）は原語を括弧で残す
  例: "Residence card (在留カード)"
- 金額は¥表記のまま
- 電話番号はそのまま
- 英語: 丁寧だがフレンドリー
- ベトナム語: 丁寧語
- タガログ語: カジュアル寄りの丁寧語、英語借用語OK
- 日本語: やさしい日本語（一文を短く、です/ます調）

### 6. 記事追加後の確認
1. `npm run build` でビルドが通ること
2. articleDataValidation が通ること（s8のURL形式、s9の日付形式）
3. 全4言語で記事が表示されること

### 7. コミットメッセージ規約
- 記事追加: `content: add {article-id} ({制度名})`
- 記事更新: `content: update {article-id} (verified {date})`
- 翻訳追加: `content: add {lang} translation for {article-id}`
- 骨格変更: `feat: {変更内容}`
- バグ修正: `fix: {修正内容}`
- 巡回関連: `crawl: {内容}`

### 8. ブランチ規約
- 記事追加: `content/{article-id}`
- 機能追加: `feat/{feature-name}`
- 修正: `fix/{issue}`

## 巡回候補からの記事化フロー
1. `data/candidates/YYYY-MM-DD.json` から候補を確認
2. 候補のURLを開いて内容を読む
3. 10項目テンプレートに沿って英語版を作成
4. 4言語のローカライズを追加
5. `npm run build` でバリデーション
6. コミット & push
