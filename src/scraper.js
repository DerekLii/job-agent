import { chromium } from "playwright";

export async function scrapeJobs() {
  // connect to running Chrome
  const browser = await chromium.connectOverCDP("http://localhost:9222");

  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  const query = "software engineer";
  await page.goto(`https://ca.indeed.com/jobs?q=${query}&l=Toronto`);

  const jobs = await page.$$eval(".job_seen_beacon", (cards) => {

    function cleanAdLink(link) {
    const [base, rest] = link.split("&ad=");
    if (!rest) return link;

    const adValue = rest.split("&")[0];
    return `${base}&ad=${adValue}`;
  }

    return cards.map((card) => {
          const title = card.querySelector("h2")?.innerText;
          const company = card.querySelector('[data-testid="company-name"]')?.innerText;
          link = card.querySelector("a")?.href;

      link = cleanAdLink(link);
  

      return {title, company, link};
    });
  });


  await browser.close();
  return jobs;
}