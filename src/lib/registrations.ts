import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

// ─────────────────────────────────────────────────────────────────────────
// Registration submissions.
// Primary sink: a Google Sheets webhook (Apps Script Web App) at
// SHEETS_WEBHOOK_URL. A local JSON copy is always appended as a backup/record
// (useful in dev and as a safety net). Column order is fixed and mirrored by
// the Apps Script (see docs/apps-script.gs).
// ─────────────────────────────────────────────────────────────────────────

export interface Registration {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  email: string;
  course: string;
  /** Which division the form belongs to, e.g. "إبسوس" or "كونترول". */
  division: string;
  submittedAt: string; // ISO
}

const FILE = path.join(process.cwd(), "content", "registrations.json");

async function appendLocal(row: Registration): Promise<void> {
  let list: Registration[] = [];
  try {
    list = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    list = [];
  }
  list.push(row);
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

async function sendToSheet(row: Registration): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { ok: true }; // not configured → local copy only
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      // Apps Script redirects; follow it.
      redirect: "follow",
    });
    if (!res.ok) return { ok: false, error: `sheet responded ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "sheet request failed" };
  }
}

export async function recordRegistration(
  row: Registration
): Promise<{ ok: boolean; error?: string }> {
  // Never lose data: local copy first, then the sheet.
  try {
    await appendLocal(row);
  } catch {
    // ignore local write failures on read-only prod filesystems
  }
  const sheet = await sendToSheet(row);
  // If a webhook is configured but failed, surface it so the operator notices.
  if (process.env.SHEETS_WEBHOOK_URL && !sheet.ok) return sheet;
  return { ok: true };
}
