// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('localhost:10000/happiness');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/SOS2324-21/);
});

test('list reports', async ({ page }) => {
  await page.goto('http://localhost:10000/api/v1/happiness-reports/loadInitialData');
  await page.goto('http://localhost:10000/happiness-reports');

  //await page.waitForTimeout(2000);

  // Expects the number of reports to be 10
  let reportCount =  (await page.locator('.reportItem').all()).length;  
  expect(reportCount).toBe(10);

});
