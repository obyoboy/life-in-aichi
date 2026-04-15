import type { Lang } from "@/lib/i18n";

/* ─── Types ─── */
export type Category = "childcare" | "medical" | "housing" | "work";

export interface ArticleSections {
  s1: string;  // What is this system?
  s2: string;  // Can foreign nationals use it?
  s2note?: string;
  s3: string;  // Who is eligible?
  s4: string;  // How much?
  s5: string;  // Where to apply?
  s6: string;  // Required documents
  s7: string;  // Common mistakes
  s8: string;  // Official page URL
  s9: string;  // Last verified date
  s10: string; // Help contacts
}

export interface Article {
  id: string;
  cat: Category;
  title: string;
  badge: "new" | "popular" | null;
  region: string;
  summary: string;  // Short one-line summary for card display (e.g. "¥15,000/month per child")
  sections: ArticleSections;
}

/* ─── Category config ─── */
export const CATEGORIES: { id: Category; icon: string }[] = [
  { id: "childcare", icon: "👶" },
  { id: "medical", icon: "🏥" },
  { id: "housing", icon: "🏠" },
  { id: "work", icon: "💼" },
];

export const CAT_COLORS: Record<Category, string> = {
  childcare: "#D46B9E",
  medical: "#4A9BD9",
  housing: "#6BBF6B",
  work: "#D4A843",
};

/* ─── CTA config per category ─── */
export const CTA_MAP: Record<Category, { key: string; btnKey: string; color: string }> = {
  childcare: { key: "ctaSim", btnKey: "ctaSimBtn", color: "#4A9BD9" },
  medical: { key: "ctaRemit", btnKey: "ctaRemitBtn", color: "#6BBF6B" },
  housing: { key: "ctaHousing", btnKey: "ctaHousingBtn", color: "#E8836B" },
  work: { key: "ctaJob", btnKey: "ctaJobBtn", color: "#D4A843" },
};

/* ─── Base articles (English) ─── */
const BASE_ARTICLES: Article[] = [
  {
    id: "jidou-teate",
    cat: "childcare",
    title: "Child Allowance (児童手当 / Jidō Teate)",
    badge: "popular",
    region: "All of Aichi",
    summary: "Up to ¥15,000/month per child",
    sections: {
      s1: "A monthly cash allowance from the government for households raising children under 18. It helps cover living and education costs.",
      s2: "Yes — foreign nationals are eligible regardless of nationality, as long as you have resident registration (住民登録) in Japan and live with the child.",
      s2note: "Undocumented residents or those without valid visa status are generally not eligible.",
      s3: "Parents or guardians who: (1) have a child under 18, (2) are registered residents in a Japanese municipality, and (3) actually raise and support the child.",
      s4: "• Age 0–2, 1st/2nd child: ¥15,000/month\n• Age 0–2, 3rd child onward: ¥30,000/month\n• Age 3–18, 1st/2nd child: ¥10,000/month\n• Age 3–18, 3rd child onward: ¥30,000/month\n※ Income limits may reduce the amount.",
      s5: "Your city/ward office (市区町村役場). In Nagoya, go to the Ward Office (区役所) of your registered address.",
      s6: "• Application form (認定請求書)\n• Residence card (在留カード)\n• Bank account passbook or card\n• My Number notification\n• Health insurance card\n• Income certificate (if you moved recently)",
      s7: "• Not applying after birth or moving — you must apply; it's not automatic.\n• Missing the deadline: apply within 15 days of birth/move to get retroactive payment.\n• Payment starts from the month AFTER your application. Past months cannot be paid retroactively, so apply as soon as possible.\n• Forgetting to re-apply after changing address.",
      s8: "https://www.city.nagoya.jp/kodomo/ninshin/1008971/1008973.html",
      s9: "2026-04-15",
      s10: "Nagoya International Center: 052-581-0100 (multilingual)\nAichi Consultation Center for Foreign Residents: 052-961-7902",
    },
  },
  {
    id: "kougaku-ryouyouhi",
    cat: "medical",
    title: "High-Cost Medical Expense Benefit (高額療養費)",
    badge: "new",
    region: "All of Japan",
    summary: "Medical costs above the limit are reimbursed",
    sections: {
      s1: "If your medical bills for one month exceed a set limit, the government reimburses the excess. This protects you from catastrophic medical costs.",
      s2: "Yes — anyone enrolled in Japanese health insurance (National Health Insurance or employer insurance) is eligible, regardless of nationality.",
      s2note: "You must be enrolled in health insurance. If you are uninsured, this does not apply.",
      s3: "Anyone enrolled in Japanese public health insurance whose monthly out-of-pocket costs exceed the income-based threshold.",
      s4: "Depends on income bracket. For a typical household:\n• General income: limit ~¥80,100/month\n• Low income: limit ~¥35,400/month\nAnything above the limit is reimbursed.",
      s5: "Your health insurance provider. For National Health Insurance (国保), apply at your city/ward office. For employer insurance, contact your company's HR.",
      s6: "• Application form\n• Health insurance card\n• Medical receipts for the month\n• Bank account info\n• Residence card",
      s7: "• Not knowing about it — many foreign residents pay full bills without claiming.\n• Waiting too long: you must apply within 2 years.\n• Not combining family members' expenses in the same household.",
      s8: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/juuyou/kougakuiryou/index.html",
      s9: "2026-04-15",
      s10: "City/Ward Office insurance counter\nAichi Medical Consultation: 052-961-7902",
    },
  },
  {
    id: "gaikokujin-jutaku",
    cat: "housing",
    title: "Housing Support for Foreign Residents (外国人住居支援)",
    badge: null,
    region: "Nagoya / Aichi",
    summary: "Guarantor services, public housing, free consultation",
    sections: {
      s1: "Various programs help foreign residents find housing, including guarantor services, public housing applications, and consultation support.",
      s2: "Yes — these programs specifically target foreign residents who face barriers in the private rental market.",
      s2note: "Eligibility and available programs vary by municipality.",
      s3: "Foreign residents registered in Aichi who have difficulty finding private rental housing due to language, lack of guarantor, or discrimination.",
      s4: "Varies by program:\n• Public housing: reduced rent based on income\n• Guarantor services: fee varies (typically 0.5–1 month rent)\n• Consultation: free",
      s5: "Nagoya International Center or your local city hall housing division.",
      s6: "• Residence card\n• Proof of income (pay slips, tax certificate)\n• Passport\n• My Number card",
      s7: "• Assuming you can't apply because you're foreign — many programs exist specifically for you.\n• Not knowing about public housing (市営住宅/県営住宅).\n• Giving up after one rejection from a private landlord.",
      s8: "https://www.nic-nagoya.or.jp/en/",
      s9: "2026-04-15",
      s10: "Nagoya International Center: 052-581-0100\nGTN housing support: 03-5291-5755",
    },
  },
  {
    id: "koyou-hoken",
    cat: "work",
    title: "Unemployment Insurance (雇用保険 / Koyō Hoken)",
    badge: null,
    region: "All of Japan",
    summary: "50–80% of previous wage for 90–330 days",
    sections: {
      s1: "If you lose your job, unemployment insurance provides cash benefits while you search for new employment. It also covers job training costs.",
      s2: "Yes — foreign workers enrolled in employment insurance are eligible, regardless of nationality or visa type (as long as the visa permits work).",
      s2note: "Technical intern trainees and some specific visa categories have special conditions.",
      s3: "Workers who: (1) were enrolled in employment insurance for at least 6 months in the past 2 years, (2) lost their job (not voluntarily in some cases), and (3) are actively seeking new employment.",
      s4: "Roughly 50–80% of your previous daily wage, for 90–330 days depending on age, years of enrollment, and reason for leaving.",
      s5: "Hello Work (ハローワーク / Public Employment Service Office) near your registered address.",
      s6: "• Separation notice (離職票) from your employer\n• Residence card\n• Passport\n• Bank account passbook\n• 2 photos (3×2.4cm)\n• My Number card or notification",
      s7: "• Not getting your 離職票 from your employer — you have the right to request it.\n• Waiting too long to register at Hello Work (go within 1 month).\n• Not knowing that Hello Work has multilingual support in Aichi.",
      s8: "https://www.hellowork.mhlw.go.jp/",
      s9: "2026-04-15",
      s10: "Hello Work Nagoya (multilingual): 052-582-8171\nAichi Labor Bureau Foreign Worker Consultation: 0570-064-699",
    },
  },
  {
    id: "shussan-ikuji-ichijikin",
    cat: "childcare",
    title: "Childbirth Lump-Sum Allowance (出産育児一時金 / Shussan Ikuji Ichijikin)",
    badge: "popular",
    region: "All of Japan",
    summary: "¥500,000 lump-sum per baby",
    sections: {
      s1: "A one-time payment of ¥500,000 per baby to help cover childbirth costs. It is paid by your health insurance provider.",
      s2: "Yes — anyone enrolled in Japanese health insurance (National Health Insurance or employer insurance) can receive this, regardless of nationality.",
      s2note: "You must be enrolled in health insurance at the time of birth. If you are uninsured, you are not eligible.",
      s3: "Anyone enrolled in Japanese public health insurance who gives birth after 12 weeks (85 days) of pregnancy, including stillbirth or miscarriage.",
      s4: "¥500,000 per baby (as of April 2023). For twins, ¥1,000,000.\nIf birth costs are less than ¥500,000, you can claim the difference.",
      s5: "For National Health Insurance (国保): your city/ward office.\nFor employer insurance: your company's HR department or insurance provider.",
      s6: "• Health insurance card\n• Mother and Child Health Handbook (母子健康手帳)\n• Bank account info\n• Agreement form from the hospital (直接支払制度)\n• Residence card",
      s7: "• Not knowing about the Direct Payment System (直接支払制度) — most hospitals handle payment directly so you don't need ¥500,000 upfront.\n• Forgetting to claim the difference if birth costs were under ¥500,000.\n• Application deadline: you must apply within 2 years from the day after the birth date. After this deadline, you lose the right to claim.",
      s8: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/shussan/index.html",
      s9: "2026-04-15",
      s10: "City/Ward Office insurance counter\nNagoya International Center: 052-581-0100",
    },
  },
  {
    id: "kokumin-kenko-hoken",
    cat: "medical",
    title: "National Health Insurance (国民健康保険 / Kokumin Kenkō Hoken)",
    badge: "popular",
    region: "All of Japan",
    summary: "Covers 70% of medical costs — mandatory",
    sections: {
      s1: "Japan's public health insurance for residents who are not covered by employer insurance. It covers 70% of medical costs — you pay only 30%.",
      s2: "Yes — all foreign residents with a valid visa of 3 months or more must enroll. It is both a right and an obligation.",
      s2note: "Short-term visitors (under 3 months) and those with employer insurance are not eligible for NHI.",
      s3: "Foreign residents who: (1) have resident registration in Japan, (2) hold a visa valid for 3+ months, and (3) are not enrolled in employer-provided health insurance.",
      s4: "NHI covers 70% of medical costs. You pay 30%.\nPremiums vary by income and municipality. Low-income households may qualify for reduced premiums.\nIn Nagoya, annual premiums for a low-income single person can be as low as ¥15,000–30,000/year.",
      s5: "Your city/ward office (市区町村役場). You must enroll within 14 days of moving to Japan or leaving employer insurance.",
      s6: "• Residence card (在留カード)\n• Passport\n• My Number card or notification\n• Proof of address (if just moved)",
      s7: "• Not enrolling because you think it's optional — it is mandatory.\n• Late enrollment: you will be charged retroactive premiums from the date you became eligible.\n• Not applying for premium reduction even when eligible (income-based reduction is available).",
      s8: "https://www.city.nagoya.jp/kurashi/hoken/1011736/1011750/1011751.html",
      s9: "2026-04-15",
      s10: "Nagoya City NHI Hotline: 052-972-2530\nNagoya International Center: 052-581-0100",
    },
  },
  {
    id: "kodomo-iryouhi-josei",
    cat: "childcare",
    title: "Child Medical Expense Subsidy (子ども医療費助成 / Kodomo Iryōhi Josei)",
    badge: "new",
    region: "Aichi Prefecture",
    summary: "Free medical care for children up to 18",
    sections: {
      s1: "A subsidy that covers most or all of children's medical costs. In many Aichi municipalities, medical care for children is free or nearly free.",
      s2: "Yes — foreign nationals with resident registration are eligible, same as Japanese residents. Nationality does not matter.",
      s2note: "The child must be registered as a resident in the municipality.",
      s3: "Children from birth up to a certain age (varies by municipality). In Nagoya, children up to 18 years old (end of high school) are covered.",
      s4: "In Nagoya:\n• Outpatient: free (no co-pay)\n• Inpatient: free (no co-pay)\n• Pharmacy: free\nSome municipalities may charge a small co-pay (e.g., ¥200/visit).",
      s5: "Your city/ward office. In Nagoya, apply at the Ward Office (区役所) of your registered address.",
      s6: "• Child's health insurance card\n• Parent's residence card\n• Child's residence card or passport\n• My Number notification\n• Bank account info (for reimbursement if applicable)",
      s7: "• Not applying because you assumed it was automatic — you must apply to receive the certificate.\n• Not bringing the certificate (受給者証) when visiting a doctor.\n• Not knowing it covers dental care too.",
      s8: "https://www.city.nagoya.jp/kodomo/kosodate/1008992/1009002/1009009.html",
      s9: "2026-04-15",
      s10: "Nagoya City Children & Youth Bureau: 052-972-2629\nNagoya International Center: 052-581-0100",
    },
  },
  {
    id: "kenei-shiei-jutaku",
    cat: "housing",
    title: "Public Housing (県営住宅・市営住宅 / Kenei/Shiei Jūtaku)",
    badge: null,
    region: "Aichi Prefecture",
    summary: "Income-based rent from ¥15,000/month",
    sections: {
      s1: "Government-owned rental apartments with reduced rent based on income. Both Aichi Prefecture (県営) and Nagoya City (市営) operate public housing.",
      s2: "Yes — foreign nationals who have resident registration and a valid visa can apply. There is no nationality restriction.",
      s2note: "Some housing types may require specific income thresholds or household conditions. Priority is sometimes given to certain visa statuses.",
      s3: "Residents who: (1) are registered in the municipality, (2) have income below the threshold, (3) need housing, and (4) have no tax arrears.",
      s4: "Rent is income-based and significantly lower than market rates.\nExample: a 2DK unit in Nagoya might cost ¥15,000–40,000/month depending on income, compared to ¥50,000–70,000 on the private market.",
      s5: "Aichi Prefecture Housing (県営住宅): Aichi Prefecture Housing Supply Corporation\nNagoya City Housing (市営住宅): Nagoya City Housing Management Center\nApplications are typically accepted during specific periods (usually twice per year).",
      s6: "• Application form\n• Residence card\n• Income certificate (所得証明書)\n• Tax payment certificate (納税証明書)\n• Current housing situation document\n• My Number notification",
      s7: "• Missing the application period — public housing has limited application windows.\n• Not knowing that vacancies are announced separately from regular recruitment.\n• Assuming you can't apply because you're foreign — you can.\n• Not checking both prefectural (県営) and city (市営) options.",
      s8: "https://www.city.nagoya.jp/kurashi/juutaku/1014583/1014585/1014586/1014587/index.html",
      s9: "2026-04-15",
      s10: "Aichi Housing Supply Corporation: 052-954-1360\nNagoya City Housing Management Center: 052-683-8282\nNagoya International Center: 052-581-0100",
    },
  },
  {
    id: "boshi-kenko-techo",
    cat: "childcare",
    title: "Maternal and Child Health Handbook (母子健康手帳 / Boshi Kenkō Techō)",
    badge: null,
    region: "All of Japan",
    summary: "Free handbook + 14 prenatal checkups (~¥100,000)",
    sections: {
      s1: "A free health handbook issued to pregnant women. It tracks pregnancy, birth, and child health records. It also gives you access to free prenatal checkups (14 visits covered).",
      s2: "Yes — all pregnant women with resident registration can receive one, regardless of nationality.",
      s2note: "You need to have pregnancy confirmed by a doctor and submitted a pregnancy notification (妊娠届) to your city/ward office.",
      s3: "Any pregnant woman who is a registered resident in Japan.",
      s4: "The handbook itself is free.\nIt comes with 14 free prenatal checkup tickets (妊婦健康診査受診票) worth approximately ¥100,000 in total.\nSome municipalities provide additional benefits like dental checkup tickets.",
      s5: "Your city/ward office or local health center (保健センター). In Nagoya, submit at your Ward Office.",
      s6: "• Pregnancy notification form (妊娠届出書) — available at the office\n• Residence card\n• My Number notification\n• Document from the doctor confirming pregnancy (optional but helpful)",
      s7: "• Waiting too long to get it — apply as soon as pregnancy is confirmed to start receiving free checkups.\n• Not knowing that multilingual versions are available in some cities.\n• Losing the handbook — it contains your child's medical history and vaccination records.\n• Not using the free checkup tickets — they expire.",
      s8: "https://www.cfa.go.jp/policies/boshihoken/techou",
      s9: "2026-04-15",
      s10: "Your local Ward Office health counter\nNagoya International Center: 052-581-0100\nAichi Consultation Center for Foreign Residents: 052-961-7902",
    },
  },
  {
    id: "wakamono-gaikokujin-mirai",
    cat: "work",
    title: "Youth & Foreigner Future Support Program (若者・外国人未来応援事業)",
    badge: "new",
    region: "Aichi Prefecture",
    summary: "Free Japanese classes at 9 locations in Aichi",
    sections: {
      s1: "A free program by Aichi Prefecture that provides learning support for high school equivalency exams and Japanese language learning for foreign residents. Classes are held at 9 locations across Aichi.",
      s2: "Yes — this program specifically targets foreign residents who need Japanese language support and young people who left school early.",
      s2note: "No visa type restriction. The program is free of charge.",
      s3: "Foreign residents in Aichi who need Japanese language learning support, and young people (post-junior-high) who want to prepare for the high school equivalency exam (高卒認定試験).",
      s4: "Completely free. No tuition or material fees.\nClasses are held at 9 locations across Aichi Prefecture.",
      s5: "Apply through the Aichi Prefectural Board of Education (愛知県教育委員会 あいちの学び推進課).\nClasses are held in Nagoya, Toyota, Okazaki, Toyohashi, Komaki, Inuyama, Tsushima, Anjo, and Nishio.",
      s6: "• Application form (available from the Aichi Board of Education)\n• No specific documents required — contact the office to confirm",
      s7: "• Not knowing this program exists — it is not widely advertised.\n• Thinking it's only for Japanese people — it explicitly includes foreign residents.\n• Not realizing that the high school equivalency certificate can help with employment and further education in Japan.",
      s8: "https://www.pref.aichi.jp/soshiki/aichi-manabi/wakagai2026.html",
      s9: "2026-04-15",
      s10: "Aichi Board of Education Learning Promotion Division: 052-954-6780\nNagoya International Center: 052-581-0100",
    },
  },
];

/* ─── Localized overrides ─── */
type ArticleOverride = {
  title?: string;
  region?: string;
  summary?: string;
  badge?: "new" | "popular" | null;
  sections?: Partial<ArticleSections>;
};
const LOCALIZED: Partial<Record<Lang, Record<string, ArticleOverride>>> = {
  ja: {
    "jidou-teate": {
      title: "児童手当（Jidō Teate）",
      summary: "子ども1人あたり月額最大15,000円",
      region: "愛知県全域",
      sections: {
        s1: "18歳未満の子どもを養育する世帯に毎月支給される現金給付です。生活費や教育費の負担軽減を目的としています。",
        s2: "はい — 日本で住民登録があり、子どもと同居して養育していれば、国籍に関係なく対象です。",
        s2note: "在留資格がない場合や在留状況が不安定な場合は、対象外となることがあります。",
        s3: "次の条件を満たす保護者が対象です: (1) 18歳未満の子どもがいる、(2) 日本の自治体に住民登録がある、(3) 実際に子どもを養育している。",
        s4: "• 0〜2歳、第1子・第2子: 月額15,000円\n• 0〜2歳、第3子以降: 月額30,000円\n• 3〜18歳、第1子・第2子: 月額10,000円\n• 3〜18歳、第3子以降: 月額30,000円\n※ 所得制限により減額される場合があります。",
        s5: "申請先はお住まいの市区町村役場です。名古屋市の場合は住民登録地の区役所で手続きします。",
        s6: "• 認定請求書\n• 在留カード\n• 通帳またはキャッシュカード\n• マイナンバー通知書（またはカード）\n• 健康保険証\n• 所得証明書（転入直後の場合）",
        s7: "• 出生・転入後に申請しない（自動支給ではありません）\n• 期限超過（出生・転入から15日以内の申請で遡及支給の可能性あり）\n• 申請のあった翌月分から支給されます。過去の分をさかのぼって支給することはできないため、早めに申請してください。\n• 転居後の手続きを忘れる",
        s10: "名古屋国際センター: 052-581-0100（多言語対応）\n愛知県外国人相談センター: 052-961-7902",
      },
    },
    "kougaku-ryouyouhi": {
      title: "高額療養費制度",
      summary: "上限を超えた医療費が払い戻し",
      region: "日本全国",
      sections: {
        s1: "1か月の医療費自己負担額が一定上限を超えた場合、超過分が払い戻される制度です。高額な医療費の負担を抑えるための仕組みです。",
        s2: "はい — 日本の公的医療保険（国民健康保険または会社の健康保険）に加入していれば、国籍に関係なく対象です。",
        s2note: "医療保険への加入が前提です。未加入の場合は対象になりません。",
        s3: "日本の公的医療保険に加入し、月ごとの自己負担額が所得区分ごとの上限を超えた人が対象です。",
        s4: "上限額は所得区分で異なります。一般的な目安:\n• 一般所得: 月約80,100円\n• 低所得: 月約35,400円\n上限を超えた分が払い戻されます。",
        s5: "申請先は加入している保険者です。国民健康保険は市区町村窓口、会社の健康保険は勤務先の担当窓口に確認します。",
        s6: "• 申請書\n• 健康保険証\n• 該当月の医療費領収書\n• 振込先口座情報\n• 在留カード",
        s7: "• 制度を知らずに全額負担したままにする\n• 申請期限を過ぎる（原則2年以内）\n• 同一世帯の医療費合算を行わない",
        s10: "市区町村の保険窓口\n愛知県医療相談: 052-961-7902",
      },
    },
    "gaikokujin-jutaku": {
      title: "外国人住居支援",
      summary: "保証人支援・公営住宅・無料相談",
      region: "名古屋 / 愛知",
      sections: {
        s1: "外国人住民の住まい探しを支援する制度があり、保証人支援、公営住宅申請、相談窓口などを利用できます。",
        s2: "はい — 民間賃貸で入居が難しい外国人住民を主な対象にした支援制度です。",
        s2note: "対象条件や利用できる制度は自治体によって異なります。",
        s3: "愛知県内に住民登録があり、言語・保証人・差別などの理由で民間賃貸が見つかりにくい外国人住民が対象です。",
        s4: "内容は制度ごとに異なります:\n• 公営住宅: 所得に応じた家賃軽減\n• 保証サービス: 手数料は物件により異なる（目安: 家賃0.5〜1か月分）\n• 相談窓口: 無料",
        s5: "名古屋国際センター、またはお住まいの自治体の住宅担当窓口で案内を受けられます。",
        s6: "• 在留カード\n• 収入証明（給与明細・課税証明など）\n• パスポート\n• マイナンバーカード",
        s7: "• 外国人だから申請できないと誤解する（対象制度があります）\n• 公営住宅（市営住宅・県営住宅）の情報を見落とす\n• 民間賃貸で1回断られて諦める",
        s10: "名古屋国際センター: 052-581-0100\nGTN住宅サポート: 03-5291-5755",
      },
    },
    "koyou-hoken": {
      title: "雇用保険（失業給付）",
      summary: "離職前賃金の50〜80%を90〜330日",
      region: "日本全国",
      sections: {
        s1: "離職後、再就職活動中の生活を支える給付を受けられる制度です。職業訓練に関する支援を受けられる場合もあります。",
        s2: "はい — 雇用保険に加入していれば、国籍に関係なく対象です（就労可能な在留資格であることが前提）。",
        s2note: "技能実習など、一部の在留資格では条件が異なる場合があります。",
        s3: "次の条件を満たす人が対象です: (1) 過去2年で原則6か月以上加入、(2) 離職している、(3) 就職活動をしている。",
        s4: "給付額は離職前賃金日額の概ね50〜80%、給付日数は90〜330日程度（年齢・加入期間・離職理由で変動）。",
        s5: "住民登録地の近くのハローワーク（公共職業安定所）で手続きします。",
        s6: "• 離職票\n• 在留カード\n• パスポート\n• 通帳\n• 写真2枚（3×2.4cm）\n• マイナンバーカードまたは通知書",
        s7: "• 会社から離職票を受け取らない（請求できます）\n• ハローワークでの手続きを遅らせる（目安: 離職後1か月以内）\n• 愛知の多言語窓口を知らない",
        s10: "ハローワーク名古屋（多言語対応）: 052-582-8171\n愛知労働局 外国人労働者相談: 0570-064-699",
      },
    },
    "shussan-ikuji-ichijikin": {
      title: "出産育児一時金",
      summary: "赤ちゃん1人につき50万円",
      region: "日本全国",
      sections: {
        s1: "出産にかかる費用を支援するため、赤ちゃん1人につき50万円が健康保険から支給される制度です。",
        s2: "はい — 日本の健康保険（国民健康保険または会社の健康保険）に加入していれば、国籍に関係なく対象です。",
        s2note: "出産時に健康保険に加入していることが前提です。未加入の場合は対象になりません。",
        s3: "日本の公的医療保険に加入し、妊娠12週（85日）以上で出産した人が対象です。死産・流産も含まれます。",
        s4: "赤ちゃん1人につき50万円（2023年4月以降）。双子の場合は100万円。\n出産費用が50万円未満の場合、差額を請求できます。",
        s5: "国民健康保険の場合は市区町村窓口、会社の健康保険の場合は勤務先の担当窓口に申請します。",
        s6: "• 健康保険証\n• 母子健康手帳\n• 振込先口座情報\n• 病院との合意書（直接支払制度）\n• 在留カード",
        s7: "• 直接支払制度を知らない（多くの病院で対応しており、退院時に50万円を用意する必要がありません）\n• 出産費用が50万円未満だった場合の差額請求を忘れる\n• 申請期限: 出産日の翌日から2年以内に申請が必要です。この期限を過ぎると受給権が消滅します。",
        s10: "市区町村の保険窓口\n名古屋国際センター: 052-581-0100",
      },
    },
    "kokumin-kenko-hoken": {
      title: "国民健康保険（国保）",
      summary: "医療費の70%を保険が負担（加入義務）",
      region: "日本全国",
      sections: {
        s1: "会社の健康保険に入っていない住民のための公的医療保険です。医療費の70%を保険が負担し、自己負担は30%です。",
        s2: "はい — 3か月以上の在留資格を持つ外国人住民は加入が義務です。権利であると同時に義務でもあります。",
        s2note: "短期滞在（3か月未満）や会社の健康保険に加入している方は対象外です。",
        s3: "次の条件を満たす外国人住民: (1) 住民登録がある、(2) 3か月以上の在留資格がある、(3) 会社の健康保険に加入していない。",
        s4: "医療費の70%を保険が負担します。自己負担は30%。\n保険料は所得と自治体によって異なります。低所得世帯は減額制度があります。",
        s5: "お住まいの市区町村役場で手続きします。転入または会社の保険を脱退してから14日以内に届出が必要です。",
        s6: "• 在留カード\n• パスポート\n• マイナンバーカードまたは通知書\n• 住所確認書類（転入直後の場合）",
        s7: "• 任意だと思って加入しない（義務です）\n• 届出が遅れると、資格取得日まで遡って保険料が請求されます\n• 所得が低くても減額申請をしない（減額制度があります）",
        s10: "名古屋市国保窓口: 052-972-2530\n名古屋国際センター: 052-581-0100",
      },
    },
    "kodomo-iryouhi-josei": {
      title: "子ども医療費助成",
      summary: "18歳まで医療費無料（名古屋市）",
      region: "愛知県",
      sections: {
        s1: "子どもの医療費の自己負担を軽減・無料化する制度です。愛知県内の多くの自治体で、子どもの医療費は無料またはほぼ無料です。",
        s2: "はい — 住民登録がある外国籍の方も、日本人と同じ条件で対象です。国籍は問いません。",
        s2note: "子どもが当該自治体に住民登録されていることが必要です。",
        s3: "出生から一定年齢までの子どもが対象です（自治体により異なります）。名古屋市では18歳（高校卒業）まで対象です。",
        s4: "名古屋市の場合:\n• 通院: 無料（自己負担なし）\n• 入院: 無料（自己負担なし）\n• 薬局: 無料\n一部の自治体では少額の自己負担（1回200円など）がある場合があります。",
        s5: "お住まいの市区町村役場で申請します。名古屋市の場合は住民登録地の区役所で手続きします。",
        s6: "• 子どもの健康保険証\n• 保護者の在留カード\n• 子どもの在留カードまたはパスポート\n• マイナンバー通知書\n• 振込先口座情報（払い戻しがある場合）",
        s7: "• 自動で適用されると思って申請しない（申請が必要です）\n• 受診時に受給者証を持っていかない\n• 歯科も対象であることを知らない",
        s10: "名古屋市子ども青少年局: 052-972-2629\n名古屋国際センター: 052-581-0100",
      },
    },
    "kenei-shiei-jutaku": {
      title: "公営住宅（県営住宅・市営住宅）",
      summary: "所得に応じた家賃 月額15,000円〜",
      region: "愛知県",
      sections: {
        s1: "所得に応じた低家賃で入居できる、自治体が運営する賃貸住宅です。愛知県営と名古屋市営の両方があります。",
        s2: "はい — 住民登録があり、有効な在留資格を持つ外国人も申請できます。国籍による制限はありません。",
        s2note: "一部の住宅タイプでは所得要件や世帯条件が異なる場合があります。",
        s3: "次の条件を満たす住民: (1) 当該自治体に住民登録がある、(2) 所得が基準以下、(3) 住宅に困窮している、(4) 税金の滞納がない。",
        s4: "家賃は所得に応じて決まり、市場価格より大幅に安くなります。\n例: 名古屋市内の2DKで月額15,000〜40,000円程度（市場相場50,000〜70,000円と比較）。",
        s5: "愛知県営住宅: 愛知県住宅供給公社\n名古屋市営住宅: 名古屋市住宅管理センター\n募集は年2回程度の期間限定です。",
        s6: "• 申請書\n• 在留カード\n• 所得証明書\n• 納税証明書\n• 現在の住居状況を示す書類\n• マイナンバー通知書",
        s7: "• 募集期間を逃す（年2回程度の限定募集です）\n• 空き家募集が通常募集と別に行われることを知らない\n• 外国人だから申請できないと誤解する（申請できます）\n• 県営と市営の両方を確認しない",
        s10: "愛知県住宅供給公社: 052-954-1360\n名古屋市住宅管理センター: 052-683-8282\n名古屋国際センター: 052-581-0100",
      },
    },
    "boshi-kenko-techo": {
      title: "母子健康手帳",
      summary: "無料の手帳＋妊婦健診14回分（約10万円相当）",
      region: "日本全国",
      sections: {
        s1: "妊娠届を提出するともらえる無料の手帳です。妊娠・出産・子どもの健康記録を管理し、14回分の妊婦健診が無料で受けられます。",
        s2: "はい — 住民登録がある妊婦であれば、国籍に関係なく交付されます。",
        s2note: "医師に妊娠を確認してもらい、市区町村窓口に妊娠届を提出する必要があります。",
        s3: "日本に住民登録があるすべての妊婦が対象です。",
        s4: "手帳自体は無料。\n14回分の妊婦健診無料受診券（総額約10万円相当）が付きます。\n自治体によっては歯科健診券などの追加特典もあります。",
        s5: "お住まいの市区町村窓口または保健センターで交付を受けます。名古屋市の場合は区役所で手続きします。",
        s6: "• 妊娠届出書（窓口で記入可能）\n• 在留カード\n• マイナンバー通知書\n• 医師からの妊娠確認書類（あれば望ましい）",
        s7: "• 取得を遅らせる（妊娠が確認されたらすぐに申請して無料健診を早く受け始める）\n• 多言語版があることを知らない（一部の自治体で対応）\n• 手帳を紛失する（子どもの医療記録・予防接種記録が入っています）\n• 無料健診受診券を使わない（有効期限があります）",
        s10: "お住まいの区役所の保健担当窓口\n名古屋国際センター: 052-581-0100\n愛知県外国人相談センター: 052-961-7902",
      },
    },
    "wakamono-gaikokujin-mirai": {
      title: "若者・外国人未来応援事業",
      summary: "無料の日本語教室（県内9か所）",
      region: "愛知県",
      sections: {
        s1: "愛知県が実施する無料の学習支援プログラムです。外国人の日本語学習支援と、高等学校卒業程度認定試験の準備を愛知県内9か所で行っています。",
        s2: "はい — このプログラムは外国人住民を明示的に対象としています。日本語学習支援が必要な外国人が利用できます。",
        s2note: "在留資格の制限はありません。無料です。",
        s3: "日本語学習支援が必要な愛知県内の外国人住民、および高卒認定試験の準備をしたい若者（中学校卒業後の進路未定者・高校中退者等）。",
        s4: "完全無料。授業料・教材費はかかりません。\n愛知県内9か所で開講しています。",
        s5: "愛知県教育委員会 あいちの学び推進課に申し込みます。\n開催地: 名古屋、豊田、岡崎、豊橋、小牧、犬山、津島、安城、西尾",
        s6: "• 申込書（愛知県教育委員会から入手可能）\n• 特に必要な書類はありません — 詳細は窓口に確認してください",
        s7: "• この制度の存在を知らない（広く宣伝されていません）\n• 日本人だけが対象だと思う（外国人も明示的に対象です）\n• 高卒認定が就職やキャリアアップに役立つことを知らない",
        s10: "愛知県教育委員会 あいちの学び推進課: 052-954-6780\n名古屋国際センター: 052-581-0100",
      },
    },
  },
};

/* ─── Helper: get localized articles ─── */
export function getArticles(lang: Lang): Article[] {
  return BASE_ARTICLES.map((article) => {
    const override = LOCALIZED[lang]?.[article.id];
    if (!override) return article;
    return {
      ...article,
      ...override,
      sections: {
        ...article.sections,
        ...(override.sections || {}),
      },
    } as Article;
  });
}

export function getArticleById(lang: Lang, id: string): Article | undefined {
  return getArticles(lang).find((a) => a.id === id);
}
