/**
 * 記事の内容を読み取り、Gemini用の画像生成プロンプトを生成して
 * prompts/{slug}.txt に保存するスクリプト。
 *
 * 実行方法:
 *   npm run gen:prompts                          （全記事）
 *   npm run gen:prompts -- --slug shugaku-enjo   （特定記事）
 *   npm run gen:prompts -- --force               （上書き再生成）
 *
 * 環境変数:
 *   GEMINI_API_KEY=your-api-key  (.env.local)
 *
 * 出力先:
 *   prompts/{slug}.txt
 */

import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getArticles, CATEGORIES } from "@/data/articles";
import type { Article } from "@/data/articles";

// ─── カテゴリ設定 ─────────────────────────────────────────

const CAT_LABEL_JA: Record<string, string> = {
  childcare: "子育て",
  medical: "医療・保険",
  housing: "住まい",
  work: "就労",
};

const CATEGORY_HINTS: Record<string, string> = {
  子育て: `
    - 人物: 親子（母+子、父+子、両親+子）
    - 場所: 学校、保育園、市役所の子育て窓口
    - 小道具: ランドセル、母子手帳、給食トレー、黄色い通学帽
    - Right Background: 学校の校舎や園庭のベンチシーン
    - Background: 公立小学校の校舎、保育園の園庭、子育て支援センターなど記事の舞台に合わせる`,
  "医療・保険": `
    - 人物: 患者（大人 or 親子）+ 医療者
    - 場所: 病院の受付、薬局、診察室
    - 小道具: 保険証、診察券、お薬手帳、体温計
    - Right Background: 病院の待合室のベンチシーン
    - Background: 病院やクリニックの外観、薬局の店先など。清潔感のある医療施設`,
  届出: `
    - 人物: 外国人住民 + 窓口職員
    - 場所: 市役所・区役所のカウンター
    - 小道具: 在留カード、転入届、パスポート、ペン
    - Right Background: 書類を記入している別の家族
    - Background: 区役所や市役所の建物外観。案内看板が見える。整った公共施設`,
  就労: `
    - 人物: 働く外国人 + 相談員 or 雇用主
    - 場所: ハローワーク、職場、相談窓口
    - 小道具: 雇用保険証、履歴書、求人票、名刺
    - Right Background: オフィスや工場で働いている人
    - Background: ハローワークの建物、オフィス街、工業地帯など`,
  住まい: `
    - 人物: カップル or 家族 + 不動産スタッフ
    - 場所: アパートの前、不動産屋の店内
    - 小道具: 鍵、契約書、間取り図、段ボール箱
    - Right Background: 新しい部屋に荷物を運び入れるシーン
    - Background: 日本のアパート・マンションの外観、不動産屋の店先、引越しトラック`,
};

// ─── プロンプトテンプレート ────────────────────────────────

const SUMMARY_SYSTEM_PROMPT = `あなたは「Life in Aichi」という外国籍住民向け支援情報サイトのイラスト企画担当です。

以下の記事本文を読み、イラスト1枚を作るために必要な情報を JSON で抽出してください。

【抽出ルール】
- targetPeople: この記事を最も必要としている人を具体的に描写する。
  国籍は特定せず「多様な外国籍の家族」とする。性別・年齢・服装を含める。
- coreScene: 記事の中で最も重要な「行動」を1つ選ぶ。
  「誰が・どこで・何をしているか」の場面にする。
  例: ×「就学援助制度を理解する」 → ○「母親が学校の事務室で申請書を受け取っている」
- keyObjects: そのシーンに登場すべき具体的な小道具を2〜4個。
  日本の行政・学校特有のアイテムを優先（ランドセル、母子手帳、保険証など）。
- keywords: 記事を読んだ外国人が「これで安心」と思えるポジティブな単語を2つ。
  日本語で、2〜4文字の短い単語にする。
- bannerText: 記事タイトルをバナーに収まる長さ（20文字以内）に調整。
- background: 記事の内容にふさわしい背景シーンを1つ選ぶ。
  記事の舞台となる場所を具体的に描写する。愛知県・名古屋の要素を自然に入れてよい。
  例: 就学援助→"日本の公立小学校の校舎と校庭、桜の木" / 国民健康保険→"市役所の保険窓口カウンター"
- backgroundDetails: 背景の雰囲気をさらに補足する描写を1〜2文で書く。
  季節感（桜、新緑など）や時間帯（明るい午前中など）を含めてよい。

JSON のみを出力してください。説明文は不要です。

---

【記事本文】`;

const PROMPT_BUILDER_SYSTEM = `あなたは画像生成プロンプトの専門家です。

以下の【記事情報JSON】と【カテゴリヒント】を使って、完成した画像生成プロンプト（英語）を1つ出力してください。

【ルール】
1. テンプレートの {変数} をすべて埋めること。
2. Style、Overall Decoration、Background Texture は一字一句変えないこと。
3. Background の {background_scene} と {background_details} は記事情報を英訳して埋めること。
4. Composition の Left / Center / Right には targetPeople と coreScene を元に具体的な人物描写を英語で書くこと。
5. 人物描写に必ず含める: full-body view、髪色・服装・表情、keyObjects、多様な国籍を感じさせる外見。
6. 人物の国籍を特定する表現（"Vietnamese", "Brazilian" 等）は使わない。
7. Top Header の banner_text は日本語のまま入れる。
8. Speech Bubbles の keyword は日本語のまま入れる。
9. 最終出力はプロンプトのみ。説明文は不要。

【スタイルテンプレート】
Subject: A full horizontal illustration of {subject_description}.

Style: Gentle, warm, clean-line vector-like illustration with soft watercolor textures and pastel colors. Minimal shading. The overall feel should be welcoming, approachable, and reassuring for foreign residents navigating Japanese bureaucracy.

Composition:
- Left Foreground: {left_foreground}
- Center Foreground: {center_foreground}
- Right Background: {right_background}
- Background (Overall): {background_scene}. {background_details}. The ground has gentle leaf scatter and the scene is bathed in soft, warm light.
- Top Header: Floating above the entire central scene is a prominent banner with a white background and red text. It has red confetti marks and a decorative vine with hearts on the left. The banner text is "{banner_text}".
- Speech Bubbles: Two floating stylized speech bubbles are positioned in the upper mid-ground. One is red with white text "{keyword_1}". The other is green with black text "{keyword_2}".
- Overall Decoration: The entire composition is encircled by a decorative floral and heart arch composed of pink cherry blossoms, light green leaves, and small red and pink floating hearts.

Background Texture: A soft, textured, warm cream and light yellow watercolor wash background.`;

// ─── ユーティリティ ───────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadEnv(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}

function articleToText(article: Article): string {
  const s = article.sections;
  return [
    `Title: ${article.title}`,
    `Summary: ${article.summary}`,
    "",
    `What is this system:\n${s.s1}`,
    "",
    `Eligibility for foreigners:\n${s.s2}`,
    s.s2note ? `Note: ${s.s2note}` : "",
    "",
    `Who is eligible:\n${s.s3}`,
    "",
    `Benefits / Amount:\n${s.s4}`,
    "",
    `Where to apply:\n${s.s5}`,
    "",
    `Required documents:\n${s.s6}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatOutput(
  article: Article,
  catJa: string,
  catEmoji: string,
  summary: Record<string, unknown>,
  imagePrompt: string
): string {
  const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  const sep = "=".repeat(60);

  const memoLines = [
    `  targetPeople: ${summary.targetPeople ?? ""}`,
    `  coreScene: ${summary.coreScene ?? ""}`,
    `  keyObjects: ${(summary.keyObjects as string[] | undefined)?.join(", ") ?? ""}`,
    `  keywords: ${(summary.keywords as string[] | undefined)?.join(", ") ?? ""}`,
    `  background: ${summary.background ?? ""}`,
  ].join("\n");

  return [
    sep,
    "Life in Aichi — 画像生成プロンプト",
    sep,
    `記事: ${article.title}`,
    `Slug: ${article.id}`,
    `カテゴリ: ${catEmoji} ${catJa}`,
    `生成日時: ${now}`,
    sep,
    "",
    "【このテキストをGeminiにコピー&ペーストしてください】",
    "",
    imagePrompt,
    "",
    sep,
    "【メモ】",
    "- 要約データ:",
    memoLines,
    "",
    "- 気に入らない場合はこのプロンプトを微調整して再度 Gemini に貼り付けてください。",
    `- 生成した画像は public/images/articles/${article.id}.png に保存してください。`,
    sep,
  ].join("\n");
}

// ─── Gemini 呼び出し ──────────────────────────────────────

async function callGemini(
  systemPrompt: string,
  userContent: string,
  jsonMode = false
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\n---\n\n${userContent}` }],
      },
    ],
    ...(jsonMode
      ? { generationConfig: { responseMimeType: "application/json" } }
      : {}),
  });

  return result.response.text().trim();
}

// ─── メイン処理 ───────────────────────────────────────────

async function main(): Promise<void> {
  loadEnv();

  // CLI フラグ解析
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf("--slug");
  const targetSlug = slugIndex !== -1 ? args[slugIndex + 1] : null;
  const forceFlag = args.includes("--force");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY が設定されていません");
    console.error("   .env.local に GEMINI_API_KEY=your-key を追加してください");
    process.exit(1);
  }

  // 出力フォルダを作成
  const outputDir = path.join(process.cwd(), "prompts");
  fs.mkdirSync(outputDir, { recursive: true });

  // 英語版記事を読み込む
  const articles = getArticles("en");
  const targets = targetSlug
    ? articles.filter((a) => a.id === targetSlug)
    : articles;

  if (targetSlug && targets.length === 0) {
    console.error(`❌ 記事が見つかりません: ${targetSlug}`);
    process.exit(1);
  }

  console.log(`📋 対象記事: ${targets.length} 件\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const article of targets) {
    const outputPath = path.join(outputDir, `${article.id}.txt`);

    if (fs.existsSync(outputPath) && !forceFlag) {
      console.log(`⏭️  スキップ: ${article.id}（プロンプトあり）`);
      skipped++;
      continue;
    }

    const catJa = CAT_LABEL_JA[article.cat] ?? article.cat;
    const catEmoji =
      CATEGORIES.find((c) => c.id === article.cat)?.icon ?? "";
    const categoryHint = CATEGORY_HINTS[catJa] ?? "";

    console.log(`🔍 記事を読み込み中: ${article.id} — ${article.title}`);

    try {
      // Step 2: 記事を要約
      console.log(`   📝 要約を生成中...`);
      const summaryText = await callGemini(
        SUMMARY_SYSTEM_PROMPT,
        articleToText(article),
        true
      );

      let summary: Record<string, unknown>;
      try {
        summary = JSON.parse(summaryText);
      } catch {
        const match = summaryText.match(/\{[\s\S]*\}/);
        if (!match) throw new Error(`JSON パース失敗: ${summaryText.slice(0, 100)}`);
        summary = JSON.parse(match[0]);
      }

      // Step 3: プロンプトを組み立て
      console.log(`   🎨 プロンプトを組み立て中...`);
      const userContent = [
        "【記事情報JSON】",
        JSON.stringify(summary, null, 2),
        "",
        "【カテゴリヒント】",
        categoryHint,
      ].join("\n");

      const imagePrompt = await callGemini(
        PROMPT_BUILDER_SYSTEM,
        userContent,
        false
      );

      // Step 4: ファイルに保存
      const output = formatOutput(article, catJa, catEmoji, summary, imagePrompt);
      fs.writeFileSync(outputPath, output, "utf-8");
      console.log(`✅ 保存しました: prompts/${article.id}.txt\n`);
      generated++;

      // レート制限対策
      if (targets.indexOf(article) < targets.length - 1) {
        await sleep(2000);
      }
    } catch (err) {
      console.error(`❌ エラー: ${article.id}`);
      console.error(
        `   ${err instanceof Error ? err.message : String(err)}\n`
      );
      errors++;
    }
  }

  console.log(`🎉 完了！ ${generated} 件のプロンプトを生成しました。`);
  if (skipped > 0) console.log(`⏭️  スキップ: ${skipped} 件`);
  if (errors > 0) console.log(`❌ エラー: ${errors} 件`);
  if (generated > 0) console.log(`📂 prompts/ フォルダを確認してください。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
