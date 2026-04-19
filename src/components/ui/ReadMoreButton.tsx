import Link from "next/link";

export function ReadMoreButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="read-more-btn">
      {label}
    </Link>
  );
}
