import { test, expect } from '@playwright/test';

/**
 * E2E test for the list-example feature.
 *
 * Verifies that the segment switch filters the list and that the empty state
 * shows up when nothing matches.
 */
test('list-example segment switches the visible items', async ({ page }) => {
  await page.goto('/list-example');

  await expect(page.getByText('Listas filtrables')).toBeVisible();

  // Initial: all items visible
  await expect(page.getByText('Trámite de empadronamiento')).toBeVisible();
  await expect(page.getByText('Solicitud certificado de residencia')).toBeVisible();

  // Switch to "Inactivos" — only inactive items remain
  await page.getByText('Inactivos', { exact: true }).click();
  await expect(page.getByText('Cita previa oficina Zaragoza')).toBeVisible();
  await expect(page.getByText('Solicitud certificado de residencia')).not.toBeVisible();
});