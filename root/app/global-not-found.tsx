import "./globals.css";
import NotFoundContent from "@/components/not-found-content";
export const metadata = { title: "Seite nicht gefunden | Zackisch" };
export default function GlobalNotFound() {
  return (
    <html lang="de">
      <body>
        <NotFoundContent />
      </body>
    </html>
  );
}
