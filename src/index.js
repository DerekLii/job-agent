import fs from "fs";
import { scrapeJobs } from "./scraper.js";
import { saveJobs } from "./sheets.js";

const FILE_PATH = "./seenJobs.json";

// load seen jobs from file
function loadSeenJobs() {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return new Set(JSON.parse(data));
  } catch {
    return new Set();
  }
}

// save seen jobs to file
function saveSeenJobs(seenJobs) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([...seenJobs], null, 2));
}

let seenJobs = loadSeenJobs();

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

  // 🔥 persist after each cycle
  saveSeenJobs(seenJobs);
}

async function start() {
  while (true) {
    try {
      await runCycle();
    } catch (err) {
      console.error("Cycle error:", err);
    }

    await new Promise(r => setTimeout(r, 60 * 1000));
  }
}

start();