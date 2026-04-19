/**
 * 記事イラスト自動生成スクリプト
 *
 * 実行方法:
 *   npx tsx --tsconfig tsconfig.scripts.json scripts/generate-article-images.ts
 *   npx tsx --tsconfig tsconfig.scripts.json scripts/generate-article-images.ts --slug shugaku-enjo
 *   npx tsx --tsconfig tsconfig.scripts.json scripts/generate-article-images.ts --force
 *   npx tsx --tsconfig tsconfig.scripts.json scripts/generate-article-images.ts --dry-run
 *
 * 環境変数:
 *   GEMINI_API_KEY=your-api-key (.env.local に記述)
 */

import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getArticles } from "@/data/articles";
import type { Article } from "@/data/articles";

// ─── 型定義 ─────────────────────────────────────────────

interface ArticleSummary {
  title: string;
  category: string;
  targetPeople: string;
  coreScene: string;
  keyObjects: string[];
  keywords: string[];
  bannerText: string;
  background: string;
  backgroundDetails: string;
}

// ─── カテゴリ設定 ─────────────────────────────────────────

const CAT_LABEL_JA: Record<string, string> = {
  childcare: "子育て",
  medical: "医療",
  housing: "住まい",
  work: "お金",
};

const CATEGORY_HINTS: Record<string, string> = {
  子育て: `
    - 人物: 親子（母+子、父+子、両親+子）
    - 場所: 学校、保育園、市役所の子育て窓口
    - 小道具: ランドセル、母子手帳、給食トレー、黄色い通学帽
    - Right Background: 学校の校舎や園庭のベンチシーン
    - Background: 公立小学校の校舎、保育園の園庭、子育て支援センターなど記事の舞台に合わせる
  `,
  医療: `
    - 人物: 患者（大人 or 親子）+ 医療者
    - 場所: 病院の受付、薬局、診察室
    - 小道具: 保険証、診察券、お薬手帳、体温計
    - Right Background: 病院の待合室のベンチシーン
    - Background: 病院やクリニックの外観、薬局の店先など。清潔感のある医療施設
  `,
  住まい: `
    - 人物: カップル or 家族 + 不動産スタッフ
    - 場所: アパートの前、不動産屋の店内
    - 小道具: 鍵、契約書、間取り図、段ボール箱
    - Right Background: 新しい部屋に荷物を運び入れるシーン
    - Background: 日本のアパート・マンションの外観、不動産屋の店先、引越しトラック
  `,
  お金: `
    - 人物: 家族で喜んでいるシーン
    - 場所: 自宅、郵便局、ATM前
    - 小道具: 封筒、通知書、通帳、電卓
    - Right Background: ポストに届いた通知を開けている人
    - Background: 日本の住宅街、郵便局、銀行の外観など。生活感のある街並み
  `,
};

// ─── スタイルテンプレート ──────────────────────────────────

const STYLE_TEMPLATE = `
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

Background Texture: A soft, textured, warm cream and light yellow watercolor wash background.
`;

// ─── ユーティリティ ───────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadEnv(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
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
  ]
    .filter(Boolean)
    .join("\n");
}

// ─── Step 1: 記事要約の生成 ───────────────────────────────

async function summarizeArticle(
  genAI: GoogleGenerativeAI,
  article: Article
): Promise<ArticleSummary> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const catJa = CAT_LABEL_JA[article.cat] ?? article.cat;
  const hints = CATEGORY_HINTS[catJa] ?? "";

  const prompt = `あなたは「Life in Aichi」という外国籍住民向け支援情報サイトのイラスト企画担当です。

以下の記事本文を読み、イラスト1枚を作るために必要な情報を JSON で抽出してください。

カテゴリ: ${catJa}
カテゴリヒント:
${hints}

【抽出ルール】
- targetPeople: この記事を最も必要としている人を具体的に描写する。
  国籍は特定せず「多様な外国籍の家族」とする。性別・年齢・服装を含める。
- coreScene: 記事の中で最も重要な「行動」を1つ選ぶ。
  「誰が・どこで・何をしているか」の場面にする。
- keyObjects: そのシーンに登場すべき具体的な小道具を2〜4個。
- keywords: 記事を読んだ外国人が「これで安心」と思えるポジティブな単語を2つ。日本語で2〜4文字。
- bannerText: 記事タイトルをバナーに収まる長さ（20文字以内）に調整。
- background: 記事の内容にふさわしい背景シーンを1つ。愛知県・名古屋の要素を自然に入れてよい。
- backgroundDetails: 背景の雰囲気をさらに補足する1〜2文。季節感や時間帯を含めてよい。

JSON のみを出力してください。説明文は不要です。

---

【記事本文】
${articleToText(article)}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  });

  const text = result.response.text();
  try {
    return JSON.parse(text) as ArticleSummary;
  } catch {
    // JSONブロックが混じっている場合は抽出
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as ArticleSummary;
    throw new Error(`JSON パース失敗: ${text.slice(0, 200)}`);
  }
}

// ─── Step 2: 画像プロンプトの生成 ────────────────────────

async function buildImagePrompt(
  genAI: GoogleGenerativeAI,
  summary: ArticleSummary,
  cat: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const catJa = CAT_LABEL_JA[cat] ?? cat;
  const hints = CATEGORY_HINTS[catJa] ?? "";

  const prompt = `あなたは画像生成プロンプトの専門家です。

以下の【記事情報JSON】と【スタイルテンプレート】を使って、完成した画像生成プロンプト（英語）を1つ出力してください。

【ルール】
1. テンプレートの {変数} をすべて埋めること。
2. Style、Overall Decoration、Background Texture は一字一句変えないこと。
3. Background の {background_scene} と {background_details} は記事情報を英訳して埋めること。
4. Composition の Left / Center / Right には targetPeople と coreScene を元に具体的な人物描写を英語で書くこと。
5. 人物描写には: full-body view、髪色・服装・表情、keyObjects を持たせる、多様な国籍を感じさせる外見を含める。
6. 人物の国籍を特定する表現（"Vietnamese", "Brazilian" 等）は使わない。
7. Top Header の banner_text は日本語のまま入れる。
8. Speech Bubbles の keyword は日本語のまま入れる。
9. 最終出力はプロンプトのみ。説明文は不要。

カテゴリヒント（Composition の参考）:
${hints}

【記事情報JSON】
${JSON.stringify(summary, null, 2)}

【スタイルテンプレート】
${STYLE_TEMPLATE}`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// ─── Step 3: Gemini API で画像生成 ───────────────────────

async function generateAndSaveImage(
  genAI: GoogleGenerativeAI,
  prompt: string,
  outputPath: string
): Promise<void> {
  const model = genAI.getGenerativeModel({
    // 画像生成対応モデル。APIバージョンによって変わる場合があります。
    // 最新モデル名は https://ai.google.dev/ で確認してください。
    model: "gemini-2.0-flash-preview-image-generation",
  });

  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] } as any,
  });

  const candidates = response.response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("画像生成レスポンスが空です");
  }

  for (const part of candidates[0].content.parts) {
    if (part.inlineData?.data) {
      const imageBuffer = Buffer.from(part.inlineData.data, "base64");
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, imageBuffer);
      return;
    }
  }

  throw new Error("レスポンスに画像データが含まれていません");
}

// ─── メイン処理 ───────────────────────────────────────────

async function main(): Promise<void> {
  loadEnv();

  // CLI フラグ解析
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf("--slug");
  const targetSlug = slugIndex !== -1 ? args[slugIndex + 1] : null;
  const forceFlag = args.includes("--force");
  const dryRunFlag = args.includes("--dry-run");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY が設定されていません");
    console.error("   .env.local に GEMINI_API_KEY=your-key を追加してください");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const outputDir = path.join(process.cwd(), "public", "images", "articles");
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

  console.log(`📋 対象記事: ${targets.length} 件`);
  if (dryRunFlag) console.log("🔍 dry-run モード: 画像生成はスキップします\n");

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const article of targets) {
    const outputPath = path.join(outputDir, `${article.id}.png`);

    if (fs.existsSync(outputPath) && !forceFlag) {
      console.log(`⏭️  スキップ: ${article.id}`);
      skipped++;
      continue;
    }

    console.log(`\n🎨 生成中: ${article.id} — ${article.title}`);

    try {
      // Step 1: 記事要約
      process.stdout.write("   Step 1/3: 記事要約中... ");
      const summary = await summarizeArticle(genAI, article);
      console.log("✓");

      // Step 2: 画像プロンプト生成
      process.stdout.write("   Step 2/3: プロンプト生成中... ");
      const imagePrompt = await buildImagePrompt(genAI, summary, article.cat);
      console.log("✓");

      if (dryRunFlag) {
        console.log(`\n📝 プロンプト:\n${imagePrompt}\n`);
        continue;
      }

      // Step 3: 画像生成
      process.stdout.write("   Step 3/3: 画像生成中... ");
      await generateAndSaveImage(genAI, imagePrompt, outputPath);
      console.log("✓");

      console.log(`✅ 保存: ${path.relative(process.cwd(), outputPath)}`);
      generated++;

      // レート制限対策
      if (targets.indexOf(article) < targets.length - 1) {
        process.stdout.write("   5秒待機中...");
        await sleep(5000);
        console.log(" 完了");
      }
    } catch (err) {
      console.error(`\n❌ エラー: ${article.id}`);
      console.error(err instanceof Error ? err.message : err);
      errors++;
    }
  }

  console.log(`\n🎉 完了 — 生成: ${generated} / スキップ: ${skipped} / エラー: ${errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
