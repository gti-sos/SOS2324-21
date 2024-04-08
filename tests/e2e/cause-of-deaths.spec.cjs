// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('localhost:10000/cause-of-deaths');
  await expect(page).toHaveTitle(/SOS2324-21/);
});

test('List Reports', async ({ page }) => {
  await page.goto('http://localhost:10000/cause-of-deaths');
  await page.getByText('Cargar datos iniciales').click();
  await page.waitForSelector('li');
  let EntityCount = (await page.locator('.list-item').all()).length;
  expect(EntityCount).toBeGreaterThan(0);
});

test('cause-of-deaths delete all reports', async ({ page }) => {
  await page.goto('http://localhost:10000/cause-of-deaths');
  await page.getByText('Eliminar todos los reportes').click();
  await page.waitForSelector('ul');
  let EntityCount = (await page.locator('#list-item').all()).length;
  expect(EntityCount).toBe(0);

});