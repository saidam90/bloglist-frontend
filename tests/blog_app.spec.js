const { test, expect, describe, beforeEach } = require("@playwright/test");
const { loginWith } = require("./helper");
const { createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ request, page }) => {
    await request.post("/api/testing/reset");

    await request.post("/api/users", {
      data: {
        name: "Heroo",
        username: "Heroo210",
        password: "Heroo210",
      },
    });

    await request.post("/api/users", {
      data: {
        name: "Zuman",
        username: "Zuman210",
        password: "Zuman210",
      },
    });

    await page.goto("/");
  });

  test("front page can be opened", async ({ page }) => {
    await page.goto("/");
    const locator = await page.getByText("log in");
    await expect(locator).toBeVisible();
    await expect(page.getByText("log in")).toBeVisible();
  });

  test("login form is shown", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "log in" }).click();

    const usernameInput = await page.getByText("username");
    await expect(usernameInput).toBeVisible();
    const passwordInput = await page.getByText("password");
    await expect(passwordInput).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.goto("/");
      await loginWith(page, "Heroo210", "Heroo210");
      await expect(page.getByText("Heroo is logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "log in" }).click();
      await page.getByTestId("username").fill("Heroo210");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      const messageDiv = await page.locator(".message");
      await expect(messageDiv).toContainText("Wrong credentials");

      await expect(page.getByText("Hero is logged in")).not.toBeVisible();
    });
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await page.goto("/");
      await loginWith(page, "Heroo210", "Heroo210");
      await expect(page.getByText("Heroo is logged in")).toBeVisible();

      await createBlog(
        page,
        "happiness",
        "happyauthor",
        "https://www.blog.com"
      );
      await expect(
        page.getByText("happiness was added by happyauthor.")
      ).toBeVisible();
    });

    test("the blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.locator(".likes")).toHaveText("0 likes");
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.locator(".likes")).toHaveText("1 likes");
    });

    test("the blog can be deleted", async ({ page }) => {
      await page.getByRole("button", { name: "view" }).click();

      const content = await page.getByText("happiness happyauthor");
      await expect(content).toBeVisible();

      page.on("dialog", async (dialog) => {
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept();
      });

      await page.getByRole("button", { name: "remove" }).click();

      await expect(content).not.toBeVisible();
    });

    test("only the user who logged in can see the delete button", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Log out" }).click();

      await page.goto("/");

      await page.getByText("log in");

      await loginWith(page, "Zuman210", "Zuman210");
      await expect(page.getByText("Zuman is logged in")).toBeVisible();
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "remove" })).toBeHidden();
    });
  });
});
