import { chromium } from "playwright";

export async function scrapeJobs() {
  // connect to running Chrome
  const browser = await chromium.connectOverCDP("http://localhost:9222");

  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  const query = "software engineer";
  await page.goto(`https://ca.indeed.com/jobs?q=${query}&l=Toronto`);
  await page.pause();

  const jobs = await page.$$eval(".job_seen_beacon", (cards) => {
    return cards.map((card) => {
          const title = card.querySelector("h2")?.innerText;
          const company = card.querySelector('[data-testid="company-name"]')?.innerText;
          const link = card.querySelector("a")?.href;
          // const text = card.innerText?.toLowerCase() || "";
          // const quickApply = text.includes("apply on indeed");

        //🔥 clean everything after & for the link.
        // 🔥 clean everything after &
        // const link = rawLink?.split("&")[0];

      return {title, company, link};
    });
  });

  await browser.close();
  return jobs;
}