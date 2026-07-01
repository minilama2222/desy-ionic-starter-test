import { test, expect } from '@playwright/test';

/**
 * Smoke test — boots the app and verifies that the home page renders
 * the four feature cards. Fails fast if anything is broken at the shell level.
 */
test('home page renders the four feature cards', async ({ page }) => {
  await page.goto('/');

  // App shell
  await expect(page.locator('ion-app')).toBeVisible();
  await expect(page.locator('ion-router-outlet')).toBeVisible();

  // Header
  await expect(page.getByText('DESY Ionic Starter')).toBeVisible();

  // Hero
  await expect(page.getByText('Bienvenido')).toBeVisible();

  // Feature cards
  await expect(page.getByText('Pestañas (Tabs)')).toBeVisible();
  await expect(page.getByText('Formularios')).toBeVisible();
  await expect(page.getByText('Listas')).toBeVisible();
  await expect(page.getByText('Componentes `desyi-*`')).toBeVisible();
});

test('unknown routes redirect to home', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText('Bienvenido')).toBeVisible();
});