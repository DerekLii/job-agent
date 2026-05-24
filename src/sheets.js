import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: "./service-account.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const client = await auth.getClient();
const sheets = google.sheets({ version: "v4", auth: client });

export async function saveJobs(jobs) {
  const rows = jobs.map(job => [
    job.title,
    job.company,
    job.link,
    new Date().toISOString(),
    "FOUND"
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows
    }
  });
}