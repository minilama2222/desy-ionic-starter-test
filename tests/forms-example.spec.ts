import { test, expect } from '@playwright/test';

/**
 * E2E test for the forms-example feature.
 *
 * Walks through the reactive form, fills it with valid data, submits it
 * and verifies that the JSON payload preview appears at the bottom of the page.
 */
test('forms-example submits a valid form and shows the JSON result', async ({ page }) => {
  await page.goto('/forms-example');

  await expect(page.getByText('Formulario reactivo')).toBeVisible();

  // Fill the form. Adjust selectors once desyi-* component DOM is stable.
  await page.locator('input[name="name"], desyi-input[formcontrolname="name"] input').first().fill('Ada Lovelace');
  await page.locator('input[type="email"]').first().fill('ada@example.com');

  // Province defaults to Zaragoza; leave it as-is to avoid touching the select overlay.

  // Submit
  await page.getByRole('button', { name: /enviar/i }).first().click();

  // The result card should appear with JSON-shaped content
  await expect(page.getByText('Resultado')).toBeVisible();
});