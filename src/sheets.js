import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

export async function saveJobs(jobs) {
  const rows = jobs.map(job => [
    job.title,
    job.company,
    job.link,
    new Date().toISOString(),
    "FOUND"
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: "Sheet1!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows
    }
  });
}