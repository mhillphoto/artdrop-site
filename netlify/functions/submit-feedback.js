/**
 * submit-feedback.js
 *
 * POST {
 *   tester:      "Kim",
 *   persona:     "Elena Vasquez",
 *   area:        "First Drop",
 *   severity:    "Major issue",
 *   description: "...",
 *   device:      "MacBook Pro / Chrome",
 *   // screenshot is handled separately via the Netlify Forms submission
 * }
 *
 * Actions:
 *   1. Stores the feedback in Netlify Blobs under key "feedback-{timestamp}-{tester}"
 *      so we have a persistent, queryable record.
 *   2. Forwards to Netlify Forms (the "artdrop-beta-feedback" form) so feedback
 *      shows up in the Netlify dashboard under Forms.
 *
 * The Netlify Forms forward is a best-effort fire-and-forget. The Blobs write
 * is the authoritative record. If Forms fails, we still return 200.
 *
 * Note on screenshots: Netlify Forms handles file uploads via the original
 * HTML form submission (multipart). This function handles the JSON path for
 * programmatic submissions from the page JS. Screenshots should still use
 * the direct form submission path (the existing data-netlify form).
 */

import { getStore } from "@netlify/blobs";

// ── Valid field values ─────────────────────────────────────────────────────
const VALID_TESTERS = new Set(["Kim", "Cassidy", "Marshall", "Mark", "Lisa", "Michael"]);

const VALID_AREAS = new Set([
  "First Launch",
  "Setup Wizard",
  "Voice Training",
  "Templates",
  "First Drop",
  "Product Quality",
  "Collection & Organization",
  "Multiple Drops",
  "Overall Experience",
  "Bug Report",
  "Other",
]);

const VALID_SEVERITY = new Set([
  "Worked great",
  "Minor issue",
  "Major issue",
  "Broken",
]);

// ── CORS headers ───────────────────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type":                 "application/json",
};

export default async function handler(req) {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: CORS,
    });
  }

  // ── Parse body ─────────────────────────────────────────────────────────
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: CORS,
    });
  }

  const { tester, persona, area, severity, description, device } = body;

  // ── Validate required fields ───────────────────────────────────────────
  if (!tester || !persona || !area || !severity || !description) {
    return new Response(
      JSON.stringify({ error: "tester, persona, area, severity, and description are required" }),
      { status: 400, headers: CORS }
    );
  }

  if (!VALID_TESTERS.has(tester)) {
    return new Response(JSON.stringify({ error: "Unknown tester" }), {
      status: 400,
      headers: CORS,
    });
  }

  // Soft-validate area and severity — log but don't reject unknown values
  // so the form still works if options are updated without deploying new functions
  if (!VALID_AREAS.has(area)) {
    console.warn(`submit-feedback: unknown area "${area}" from ${tester}`);
  }
  if (!VALID_SEVERITY.has(severity)) {
    console.warn(`submit-feedback: unknown severity "${severity}" from ${tester}`);
  }

  // ── Build feedback record ──────────────────────────────────────────────
  const timestamp = new Date().toISOString();
  const feedbackKey = `feedback-${timestamp}-${tester.toLowerCase()}`;

  const record = {
    key:         feedbackKey,
    timestamp,
    tester,
    persona,
    area,
    severity,
    description: description.trim(),
    device:      (device || "").trim() || "Not specified",
  };

  // ── Write to Blobs (authoritative record) ─────────────────────────────
  let blobsOk = false;
  try {
    const store = getStore("artdrop-beta");
    await store.set(feedbackKey, JSON.stringify(record));
    blobsOk = true;
  } catch (err) {
    console.error("Blobs error in submit-feedback:", err.message);
    // Don't return 500 yet — try Forms forward first, then decide
  }

  // ── Forward to Netlify Forms (best-effort) ─────────────────────────────
  // This gives Michael the Netlify Forms dashboard view with email notifications.
  // We post as form-encoded to the site root, which Netlify intercepts.
  let formsOk = false;
  try {
    const formBody = new URLSearchParams({
      "form-name":  "artdrop-beta-feedback",
      "tester-name": tester,
      persona,
      area,
      severity,
      description:  record.description,
      device:       record.device,
    });

    // The URL needs to point to the site root. In production this is the
    // Netlify site URL. We use the Netlify-injected URL environment variable.
    const siteUrl = process.env.URL || "http://localhost:8888";
    const formsRes = await fetch(siteUrl + "/", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    formBody.toString(),
    });
    formsOk = formsRes.ok;
    if (!formsOk) {
      console.warn(`submit-feedback: Netlify Forms returned ${formsRes.status}`);
    }
  } catch (err) {
    console.warn("submit-feedback: Netlify Forms forward failed:", err.message);
  }

  // ── If both storage paths failed, return 500 ──────────────────────────
  if (!blobsOk && !formsOk) {
    return new Response(
      JSON.stringify({ ok: false, error: "Failed to save feedback. Please try again." }),
      { status: 500, headers: CORS }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, key: feedbackKey, timestamp }),
    { status: 200, headers: CORS }
  );
}
