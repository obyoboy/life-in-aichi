"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

export function SidebarTOC({ items, tocLabel }: { items: TocItem[]; tocLabel: string }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <div className="sidebar-section">
      <h2 className="sidebar-heading">{tocLabel}</h2>
      <nav aria-label={tocLabel}>
        <ol className="sidebar-toc-list">
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`sidebar-toc-link${activeId === item.id ? " active" : ""}`}
              >
                <span className="sidebar-toc-num" aria-hidden="true">{index + 1}.</span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
