import { test, expect } from "@playwright/test";

const TOP_PAGE_URL = "/";

// UI smoke test that ensures the mock API is wired correctly and key sections render.
test.describe("ポートフォリオ トップページ", () => {
  test("プロジェクト一覧を表示できる", async ({ page }) => {
    await page.goto(TOP_PAGE_URL);

    await expect(page.getByRole("heading", { name: "PROJECTS" })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "10年弱のITエンジニア経験 AWS・サーバーレス・技術研修のスペシャリスト",
      })
    ).toBeVisible();

    const detailButtons = page.getByRole("button", { name: "詳細を見る" });
    if ((await detailButtons.count()) > 0) {
      await expect(detailButtons.first()).toBeVisible();
    }

    await expect(
      page.getByText("AWS移行／サーバーレス開発／技術研修／自動化／システム設計レビューなど多様なPJ経験")
    ).toBeVisible();
  });
});

test.describe("プロジェクト詳細ページ", () => {
  test("トップページからたどれる詳細ページが表示される", async ({ page }) => {
    await page.goto(TOP_PAGE_URL);

  const detailLinks = page.locator('[data-testid="project-detail-link"]');
  const linkCount = await detailLinks.count();
  expect(linkCount).toBeGreaterThan(0);

    const hrefs = new Set<string>();
    for (let index = 0; index < linkCount; index += 1) {
      const href = await detailLinks.nth(index).getAttribute("href");
      if (href) {
        hrefs.add(href);
      }
    }

  for (const href of hrefs) {
      await test.step(`ページ遷移: ${href}`, async () => {
        await page.goto(href, { waitUntil: "networkidle" });
        await expect(page.locator("text=This page could not be found.")).toHaveCount(0);
        await expect(page.locator("text=404:")).toHaveCount(0);
        await expect(page.getByRole("heading").first()).toBeVisible();
      });
    }
  });
});
