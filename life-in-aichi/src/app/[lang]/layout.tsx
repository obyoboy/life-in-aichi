import { notFound } from "next/navigation";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { assertArticleDataIntegrity } from "@/lib/articleDataValidation";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGUAGES.includes(lang as Lang)) notFound();

  assertArticleDataIntegrity();
  const t = getTranslations(lang as Lang);

  return (
    <div lang={lang}>
      <Header lang={lang as Lang} t={t} />
      <main>{children}</main>
      <Footer t={t} />
    </div>
  );
}
