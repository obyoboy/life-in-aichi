import type { Translations } from "@/lib/translations";

export function SidebarProfile({ t }: { t: Translations }) {
  return (
    <div className="sidebar-section">
      <div className="sidebar-profile">
        <div className="sidebar-profile-icon" aria-hidden="true">🌏</div>
        <p className="sidebar-profile-title">Life in Aichi</p>
        <p className="sidebar-profile-desc">{t.siteSubtitle}</p>
        <p className="sidebar-profile-location">
          <span aria-hidden="true">📍</span> 愛知県 / 名古屋
        </p>
      </div>
    </div>
  );
}
