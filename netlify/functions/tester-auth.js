/**
 * tester-auth.js
 *
 * POST { password } → { ok: true, tester: "Kim", claimed_persona: "Elena Vasquez" | null }
 *
 * Validates individual tester passwords and returns the tester's identity plus
 * their currently claimed persona (if any) from Netlify Blobs.
 *
 * 401 on wrong password.
 */

import { getStore } from "@netlify/blobs";

// ── Tester roster ──────────────────────────────────────────────────────────
// Each password maps to a tester name. Passwords are intentionally lowercase
// first names — easy to remember, not guessable by outsiders.
const TESTERS = {
  kim:      "Kim",
  cassidy:  "Cassidy",
  marshall: "Marshall",
  mark:     "Mark",
  elisa:    "Elisa",
  jen:      "Jen",
  michael:  "Michael", // admin
};

// ── CORS headers ───────────────────────────────────────────────────────────
// Same-origin only, but Netlify Functions run on a different path so we need
// explicit CORS for fetch() calls from the page.
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

  const password = (body.password || "").trim().toLowerCase();

  if (!password) {
    return new Response(JSON.stringify({ error: "Password required" }), {
      status: 400,
      headers: CORS,
    });
  }

  // ── Validate password ──────────────────────────────────────────────────
  const testerName = TESTERS[password];
  if (!testerName) {
    return new Response(JSON.stringify({ ok: false, error: "Wrong password" }), {
      status: 401,
      headers: CORS,
    });
  }

  // ── Look up claimed persona from Blobs ─────────────────────────────────
  let claimedPersona = null;
  let completed = false;

  try {
    const store = getStore("artdrop-beta");

    // persona-claims is a JSON map: { "Elena Vasquez": "Kim", ... }
    const claimsRaw = await store.get("persona-claims");
    if (claimsRaw) {
      const claims = JSON.parse(claimsRaw);
      // Find which persona this tester has claimed (if any)
      for (const [persona, claimedBy] of Object.entries(claims)) {
        if (claimedBy === testerName) {
          claimedPersona = persona;
          break;
        }
      }
    }

    // Check if tester has completed at least one persona test
    const testerStateRaw = await store.get(`tester-${testerName.toLowerCase()}`);
    if (testerStateRaw) {
      const testerState = JSON.parse(testerStateRaw);
      completed = Boolean(testerState.completed);
    }
  } catch (err) {
    // Blobs not available (local dev, first deploy, etc.) — degrade gracefully
    console.error("Blobs error in tester-auth:", err.message);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      tester: testerName,
      claimed_persona: claimedPersona,
      completed,
    }),
    { status: 200, headers: CORS }
  );
}
