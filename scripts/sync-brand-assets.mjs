import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const repository = resolve(fileURLToPath(new URL("..", import.meta.url)));
const project = process.argv[2];
if (!["root", "app", "support", "internal"].includes(project)) throw new Error("Expected application name");
const output = resolve(repository, project, "public/zackisch");
await mkdir(output, { recursive: true });
for (const [source, target] of [
  ["brand/combination_mark.svg", "combination-mark.svg"],
  ["brand/brand_mark.svg", "brand-mark.svg"],
  ["mascot/mascot_curious_welcome.svg", "curious.svg"],
  ["mascot/mascot_error_404.svg", "not-found.svg"],
]) await copyFile(resolve(repository, "assets/zackisch", source), resolve(output, target));
