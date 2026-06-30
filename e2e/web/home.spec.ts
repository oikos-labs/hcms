import { expect, test } from '@playwright/test';

test('renders the HCMS home screen', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('HCMS')).toBeVisible();
});
