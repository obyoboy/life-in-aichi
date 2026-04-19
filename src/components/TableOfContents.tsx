interface TocItem {
  id: string;
  label: string;
}

export function TableOfContents({
  items,
  tocLabel,
}: {
  items: TocItem[];
  tocLabel: string;
}) {
  if (items.length < 2) return null;

  return (
    <details className="toc">
      <summary className="toc-summary">{tocLabel}</summary>
      <nav aria-label={tocLabel}>
        <ol className="toc-list">
          {items.map((item, index) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="toc-link">
                <span className="toc-num" aria-hidden="true">
                  {index + 1}.
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
