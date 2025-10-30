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
