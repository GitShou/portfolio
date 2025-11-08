import { copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";

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

      const destinationPath = join(directory, entry.name.slice(0, -".html".length));
      try {
        await copyFile(absolutePath, destinationPath);
      } catch (error) {
        // 既にファイルが存在する場合などは無視して続行
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
          throw error;
        }
      }
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
