import { expect, test } from "@playwright/test";

test("system admin page renders users", async ({ page }) => {
  await page.route("http://localhost:3000/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-1",
        email: "admin@example.com",
        displayName: "Admin Elek",
        googleSubject: "google-admin-1",
        isEnabled: true,
        isAdmin: true,
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
          users: [
            {
              id: "user-1",
              email: "admin@example.com",
              displayName: "Admin Elek",
              googleSubject: "google-admin-1",
              isEnabled: true,
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z",
            },
            {
              id: "user-2",
              email: "user@example.com",
              displayName: null,
              googleSubject: "google-user-2",
              isEnabled: false,
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z",
            },
          ],
        },
      }),
    });
  });

  await page.goto("/system-admin.html");

  await expect(page.getByRole("heading", { name: "Felhasználók kezelése" })).toBeVisible();
  await expect(page.getByText("admin@example.com").first()).toBeVisible();
  await expect(page.getByText("user@example.com").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Engedélyezés" })).toBeVisible();
});
