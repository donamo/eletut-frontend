import { expect, test } from "@playwright/test";

test("timeline page shows empty state and opens create dialog", async ({ page }) => {
  await page.route("http://localhost:3000/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-1",
        email: "teszt@example.com",
        displayName: "Teszt Elek",
        googleSubject: "google-user-1",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      }),
    });
  });

  await page.route("http://localhost:3000/graphql", async (route) => {
    const request = route.request().postDataJSON() as { operationName?: string } | null;
    const data =
      request?.operationName === "TopLifeEventLocations"
        ? {
            topLifeEventLocations: [
              { location: "Budapest", count: 3 },
              { location: "Szeged", count: 1 },
            ],
          }
        : request?.operationName === "Labels"
          ? {
              labels: [{ id: "label-1", name: "munka", color: "BLUE", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" }],
            }
          : request?.operationName === "EgoStates"
          ? {
              egoStates: {
                gyermeki: [{ id: "child-1", name: "Alkalmazkodó gyermek", essence: "Megfelelés", innerSentence: "Jónak kell lennem.", sortOrder: 1 }],
                szuloi: [{ id: "parent-1", name: "Gondoskodó szülő", essence: "Támogatás", innerSentence: "Segítek.", sortOrder: 1 }],
                felnott: [{ id: "adult-1", name: "Racionális felnőtt", essence: "Jelenlét", innerSentence: "Megnézem a tényeket.", sortOrder: 1 }],
              },
            }
          : { lifeEvents: [] };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data }),
    });
  });

  await page.goto("/index.html");

  await expect(page.getByRole("heading", { name: "Életút projekt" })).toBeVisible();
  await expect(page.getByText("Még nincs rögzített életeseményed.")).toBeVisible();

  await page.getByRole("button", { name: "Első esemény létrehozása" }).click();

  await expect(page.getByRole("dialog", { name: "Új esemény" })).toBeVisible();
  await expect(page.getByLabel("Cím")).toBeVisible();
  await expect(page.getByLabel("Helyszín")).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Új esemény" }).getByText("Labelek")).toBeVisible();
  await expect(page.getByText("munka")).toBeVisible();
  await expect(page.locator("datalist#life-event-location-suggestions option[value='Budapest']")).toHaveCount(1);
  await expect(page.getByText("Szín", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Fontosság")).toBeVisible();
  await expect(page.getByText("Gyerek", { exact: true })).toBeVisible();
  await expect(page.getByText("Szülő", { exact: true })).toBeVisible();
  await expect(page.getByText("Felnőtt", { exact: true })).toBeVisible();
  await page.getByText("Gyerek", { exact: true }).click();
  await expect(page.getByText("Alkalmazkodó gyermek")).toBeVisible();
});
