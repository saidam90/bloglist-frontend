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
    });

    test("a new blog can be created", async ({ page }) => {
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

    describe("and a note exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "happiness",
          "happyauthor",
          "https://www.blog.com"
        );
      });

      test("the blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();

        const likesText = await page.getByText("0 likes");
        await expect(likesText).toBeVisible();

        const likeButton = likesText.getByRole("button", { name: "like" });
        await likeButton.click();

        const updatedLikesText = page.getByText("1 likes");
        await expect(updatedLikesText).toBeVisible();
      });
    });
  });
});
