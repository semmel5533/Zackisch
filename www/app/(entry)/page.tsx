import { BrowserLocaleRedirect } from "@/components/browser-locale-redirect";
import { WebsiteHome } from "@/components/website-home";
import { websiteStructuredData } from "@/lib/structured-data";

export default function EntryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData("de-de")).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <BrowserLocaleRedirect />
      <WebsiteHome locale="de-de" />
    </>
  );
}
