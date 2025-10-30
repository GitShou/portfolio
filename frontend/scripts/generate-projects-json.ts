import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PROJECTS_DATA } from "../../infrastructure/ap-northeast-1/data/ProjectData";

async function main() {
  const outputPath = resolve(process.cwd(), "mocks", "projects.json");
  const payload = { projects: PROJECTS_DATA };
  const contents = `${JSON.stringify(payload, null, 2)}\n`;
  await writeFile(outputPath, contents, { encoding: "utf8" });
  console.log(`Generated ${payload.projects.length} projects -> ${outputPath}`);
}

main().catch((error) => {
  console.error("Failed to generate projects.json", error);
  process.exitCode = 1;
});
