/**
 * get-status.js
 *
 * GET → {
 *   personas: {
 *     "Elena Vasquez":  "Kim" | null,
 *     "Marcus Cole":    null,
 *     "Janelle Torres": "Cassidy" | null,
 *     "David Okonkwo":  null,
 *     "Own Artwork":    null,  // never locked
 *   },
 *   testers: {
 *     "Kim":      { persona: "Elena Vasquez" | null, completed: false },
 *     "Cassidy":  { persona: null, completed: false },
 *     ...
 *   }
 * }
 *
 * Used by the testing page to show who has claimed what, and by Michael
 * to see overall progress without digging into Netlify Blobs directly.
 */

import { getStore } from "@netlify/blobs";

// ── Canonical data ─────────────────────────────────────────────────────────
const ALL_PERSONAS = [
  "Elena Vasquez",
  "Marcus Cole",
  "Janelle Torres",
  "David Okonkwo",
  "Own Artwork",
];

const ALL_TESTERS = ["Kim", "Cassidy", "Marshall", "Mark", "Lisa", "Michael"];

// ── CORS headers ───────────────────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type":                 "application/json",
};

export default async function handler(req) {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: CORS,
    });
  }

  // ── Build default (empty) state ────────────────────────────────────────
  const personaStatus = {};
  for (const p of ALL_PERSONAS) {
    personaStatus[p] = null; // null = unclaimed
  }

  const testerStatus = {};
  for (const t of ALL_TESTERS) {
    testerStatus[t] = { persona: null, completed: false };
  }

  // ── Read from Blobs ────────────────────────────────────────────────────
  try {
    const store = getStore("artdrop-beta");

    // 1. Persona claims
    const claimsRaw = await store.get("persona-claims");
    if (claimsRaw) {
      const claims = JSON.parse(claimsRaw);
      for (const [persona, claimedBy] of Object.entries(claims)) {
        // Only surface known personas
        if (personaStatus.hasOwnProperty(persona)) {
          personaStatus[persona] = claimedBy;
        }
        // Mirror into tester status
        if (testerStatus.hasOwnProperty(claimedBy)) {
          testerStatus[claimedBy].persona = persona;
        }
      }
    }

    // 2. Per-tester state (completed flag)
    for (const tester of ALL_TESTERS) {
      const stateRaw = await store.get(`tester-${tester.toLowerCase()}`);
      if (stateRaw) {
        const state = JSON.parse(stateRaw);
        testerStatus[tester].completed = Boolean(state.completed);
      }
    }
  } catch (err) {
    // Blobs not available — return the empty-state defaults, don't crash
    console.error("Blobs error in get-status:", err.message);
  }

  return new Response(
    JSON.stringify({ personas: personaStatus, testers: testerStatus }),
    { status: 200, headers: CORS }
  );
}
