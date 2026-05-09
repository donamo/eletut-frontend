import { expect, test } from "@playwright/test";

test("labels admin page renders existing labels", async ({ page }) => {
  await page.route("http://localhost:3000/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-1",
        email: "teszt@example.com",
        displayName: "Teszt Elek",
        googleSubject: "google-user-1",
        isEnabled: true,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      }),
    });
  });

  await page.route("http://localhost:3000/graphql", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          labels: [{ id: "label-1", name: "munka", color: "BLUE", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" }],
        },
      }),
    });
  });

  await page.goto("/admin.html");

  await expect(page.getByRole("heading", { name: "Labelek kezelése" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Meglévő labelek" })).toBeVisible();
  await expect(page.getByText("munka")).toBeVisible();
});
