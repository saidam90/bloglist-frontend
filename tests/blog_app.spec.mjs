// tests/blog_app.spec.mjs
import { test, expect } from "@playwright/test";

test.describe("Blog app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    // await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "log in" }).click();
    await page.getByRole("textbox").first().fill("Inara210");
    await page.getByRole("textbox").last().fill("Inara210");
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("Inara is logged in")).toBeVisible();
  });
});
