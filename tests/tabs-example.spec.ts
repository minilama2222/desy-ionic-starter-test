import { test, expect } from '@playwright/test';

/**
 * E2E test for the tabs-example feature.
 *
 * Navigates to /tabs-example, switches between tabs and verifies that each
 * tab's content renders.
 */
test('tabs-example renders all four tab labels', async ({ page }) => {
  await page.goto('/tabs-example');

  await expect(page.getByRole('button', { name: /inicio/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /buscar/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /favoritos/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /perfil/i })).toBeVisible();

  // Click the Search tab
  await page.getByRole('button', { name: /buscar/i }).click();
  await expect(page.getByPlaceholder(/busca un trámite/i)).toBeVisible();
});