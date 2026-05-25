import fs from "fs";

const FILE = "./seenJobs.json";

export function loadSeenJobs() {
  if (!fs.existsSync(FILE)) return new Set();

  const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  return new Set(data);
}

export function saveSeenJobs(seenJobs) {
  fs.writeFileSync(FILE, JSON.stringify([...seenJobs], null, 2));
}