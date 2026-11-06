import { BrowserLocaleRedirect } from "@/components/browser-locale-redirect";
import { WebsiteHome } from "@/components/website-home";
import { defaultLocale } from "@/lib/content";
import { websiteStructuredData } from "@/lib/structured-data";

export default function EntryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData(defaultLocale)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <BrowserLocaleRedirect />
      <WebsiteHome locale={defaultLocale} />
    </>
  );
}
