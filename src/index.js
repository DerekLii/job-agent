import { scrapeJobs } from "./scraper.js";
// import { saveJobs } from "./sheet.js";

const seenJobs = new Set();

async function runCycle() {
  console.log("Checking for new jobs...");

  const jobs = await scrapeJobs();

  const newJobs = jobs.filter(job => {
    if (!job.link) return false;
    if (seenJobs.has(job.link)) return false;

    seenJobs.add(job.link);
    return true;
  });

  console.log(`New jobs found: ${newJobs.length}`);

  await saveJobs(newJobs);

}

async function start() {
  while (true) {
    try {
      await runCycle();
    } catch (err) {
      console.error("Cycle error:", err);
    }

    // wait 60 seconds
    await new Promise(r => setTimeout(r, 60 * 1000));
  }
}

start();