import Image from "next/image";

interface Props {
  slug: string;
  alt: string;
}

export function ArticleHeroImage({ slug, alt }: Props) {
  return (
    <figure className="article-hero-image">
      <Image
        src={`/images/articles/${slug}.png`}
        alt={alt}
        width={1200}
        height={630}
        priority
        style={{ width: "100%", height: "auto", borderRadius: "12px" }}
      />
    </figure>
  );
}
