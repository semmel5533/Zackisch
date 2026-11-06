import "./globals.css";
import NotFoundContent from "@/components/not-found-content";
export const metadata = {
  icons: { icon: "/brand/logo/platform/signet--favicon.svg" },
};
export default function GlobalNotFound() {
  return (
    <html lang="de">
      <body>
        <NotFoundContent />
      </body>
    </html>
  );
}
