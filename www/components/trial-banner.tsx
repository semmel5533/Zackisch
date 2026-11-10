import { formatCopy } from "@/lib/format-copy";

type TrialBannerCopy = {
  heroTrial: string;
};

export function TrialBanner({ copy }: { copy: TrialBannerCopy }) {
  return (
    <aside className="top-banner" aria-label={copy.heroTrial}>
      <div className="top-banner-inner container">
        <p className="top-banner-text">{formatCopy(copy.heroTrial)}</p>
      </div>
    </aside>
  );
}
