import { chromium } from "playwright";

export async function scrapeJobs() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const query = "software engineer";
  await page.goto(`https://ca.indeed.com/jobs?q=${query}&l=Toronto`);

const jobs = await page.$$eval(".job_seen_beacon", (cards) => {
  return cards.map((card) => {
        const title = card.querySelector("h2")?.innerText;
        const company = card.querySelector('[data-testid="company-name"]')?.innerText;
        const link = card.querySelector("a")?.href;
    return {title, company, link};
  });
});

  await browser.close();
  return jobs;
}