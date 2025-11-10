/// <reference types="node" />
import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

async function ensureDirectory(directoryPath: string): Promise<void> {
  const existing = await stat(directoryPath).catch(() => null);

  if (existing?.isDirectory()) {
    return;
  }

  if (existing) {
    await rm(directoryPath, { recursive: true, force: true });
  }

  await mkdir(directoryPath, { recursive: true });
}

async function walk(directory: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = join(directory, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        return;
      }

      if (!entry.isFile()) {
        return;
      }

      if (!entry.name.endsWith(".html") || entry.name === "index.html") {
        return;
      }

      const directoryName = entry.name.slice(0, -".html".length);
      const directoryPath = join(directory, directoryName);
      await ensureDirectory(directoryPath);
      const indexPath = join(directoryPath, "index.html");
      await copyFile(absolutePath, indexPath);
      await rm(absolutePath);
    })
  );
}

async function main() {
  const outDir = join(process.cwd(), "out");
  await walk(outDir);
}

main().catch((error) => {
  console.error("Failed to prepare static paths", error);
  process.exitCode = 1;
});
