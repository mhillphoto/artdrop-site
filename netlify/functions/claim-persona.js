/**
 * claim-persona.js
 *
 * POST { tester: "Kim", persona: "Elena Vasquez" }
 *   → { ok: true, persona: "Elena Vasquez", tester: "Kim" }
 *   → { ok: false, error: "...", claimedBy: "Marshall" }  if already taken
 *
 * Rules:
 *   - Each persona can only be claimed by one tester at a time.
 *   - Claiming a persona you already hold is a no-op (idempotent).
 *   - "Own Artwork" is never locked — any tester can pick it.
 *   - "Own Artwork" requires the tester to have completed at least one
 *     persona test first (completed flag must be set on their state).
 *
 * Persona claims are stored in Netlify Blobs under key "persona-claims"
 * as a flat JSON map: { "Elena Vasquez": "Kim", "Marcus Cole": "Marshall", ... }
 */

import { getStore } from "@netlify/blobs";

// ── Valid personas (must match testing/index.html) ─────────────────────────
const VALID_PERSONAS = new Set([
  "Elena Vasquez",
  "Marcus Cole",
  "Janelle Torres",
  "David Okonkwo",
  "Own Artwork",
]);

// ── Valid tester names ─────────────────────────────────────────────────────
const VALID_TESTERS = new Set(["Kim", "Cassidy", "Marshall", "Mark", "Lisa", "Michael"]);

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

  const { tester, persona } = body;

  if (!tester || !persona) {
    return new Response(JSON.stringify({ error: "tester and persona are required" }), {
      status: 400,
      headers: CORS,
    });
  }

  if (!VALID_TESTERS.has(tester)) {
    return new Response(JSON.stringify({ error: "Unknown tester" }), {
      status: 400,
      headers: CORS,
    });
  }

  if (!VALID_PERSONAS.has(persona)) {
    return new Response(JSON.stringify({ error: "Unknown persona" }), {
      status: 400,
      headers: CORS,
    });
  }

  const store = getStore("artdrop-beta");

  // ── "Own Artwork" requires completed flag ──────────────────────────────
  if (persona === "Own Artwork") {
    try {
      const testerStateRaw = await store.get(`tester-${tester.toLowerCase()}`);
      const testerState = testerStateRaw ? JSON.parse(testerStateRaw) : {};
      if (!testerState.completed) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "You need to complete a persona test before testing with your own artwork.",
          }),
          { status: 403, headers: CORS }
        );
      }
    } catch (err) {
      console.error("Blobs error checking completed flag:", err.message);
      return new Response(
        JSON.stringify({ ok: false, error: "Server error checking eligibility." }),
        { status: 500, headers: CORS }
      );
    }

    // "Own Artwork" is never locked — return ok immediately
    return new Response(
      JSON.stringify({ ok: true, persona, tester }),
      { status: 200, headers: CORS }
    );
  }

  // ── Read current claims ────────────────────────────────────────────────
  let claims;
  try {
    const claimsRaw = await store.get("persona-claims");
    claims = claimsRaw ? JSON.parse(claimsRaw) : {};
  } catch (err) {
    console.error("Blobs error reading persona-claims:", err.message);
    return new Response(
      JSON.stringify({ ok: false, error: "Server error reading claims." }),
      { status: 500, headers: CORS }
    );
  }

  const currentHolder = claims[persona];

  // ── Already claimed by this tester → idempotent ok ───────────────────
  if (currentHolder === tester) {
    return new Response(
      JSON.stringify({ ok: true, persona, tester }),
      { status: 200, headers: CORS }
    );
  }

  // ── Already claimed by someone else → reject ──────────────────────────
  if (currentHolder && currentHolder !== tester) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: `${persona} is already claimed by ${currentHolder}.`,
        claimedBy: currentHolder,
      }),
      { status: 409, headers: CORS }
    );
  }

  // ── Release any previous claim this tester held ───────────────────────
  // A tester can only hold one persona at a time. Free their old one first.
  for (const [existingPersona, claimedBy] of Object.entries(claims)) {
    if (claimedBy === tester && existingPersona !== persona) {
      delete claims[existingPersona];
    }
  }

  // ── Claim the new persona ─────────────────────────────────────────────
  claims[persona] = tester;

  try {
    await store.set("persona-claims", JSON.stringify(claims));
  } catch (err) {
    console.error("Blobs error writing persona-claims:", err.message);
    return new Response(
      JSON.stringify({ ok: false, error: "Server error saving claim." }),
      { status: 500, headers: CORS }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, persona, tester }),
    { status: 200, headers: CORS }
  );
}
