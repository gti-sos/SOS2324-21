import chromium from 'playwright';
let browser;
let page;

beforeAll(async () => {
  browser = await chromium.launch();
});
afterAll(async () => {
  await browser.close();
});
beforeEach(async () => {
  page = await browser.newPage();
});
afterEach(async () => {
  await page.close();
});
it("Home page should have the correct title", async () => {
    await page.goto("http://localhost:10000/cause-of-deaths");
    expect(await page.title()).toBe("cause-of-deaths");
    await page.getByText('Cargar Datos Iniciales').click();
});