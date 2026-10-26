import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";
export default function NotFound() {
  return (
    <main className="not-found container" id="main">
      <Image src="/zackisch/not-found.svg" alt="" width="140" height="140" />
      <section lang="de">
        <h1>{content["de-de"].notFound}</h1>
        <p>{content["de-de"].notFoundText}</p>
        <Link href="/de-de">{content["de-de"].back}</Link>
      </section>
      <section lang="en">
        <h2>{content["de-en"].notFound}</h2>
        <p>{content["de-en"].notFoundText}</p>
        <Link href="/de-en">{content["de-en"].back}</Link>
      </section>
    </main>
  );
}
