import { expect, test } from "@playwright/test";

test("login page shows Google login button", async ({ page }) => {
  await page.route("http://localhost:3000/me", async (route) => {
    await route.fulfill({ status: 401, body: "" });
  });

  await page.goto("/login.html");

  await expect(page.getByRole("heading", { name: "Belépés" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Belépés Google-fiókkal/i })).toBeVisible();
});
