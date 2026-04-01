/**
 * form-handler.js
 *
 * Handles the automated form submission pipeline for Business Concierge.
 * When a Netlify form is submitted, this function determines which form it was
 * and sends the appropriate next-step email via Resend.
 *
 * ── WEBHOOK SETUP ──────────────────────────────────────────────────────────
 * Netlify dashboard → Site Settings → Forms → Outgoing notifications
 *   → Add notification → Outgoing webhook
 *   URL:   /.netlify/functions/form-handler
 *   Event: New form submission
 *
 * ── ENVIRONMENT VARIABLES (set in Netlify dashboard) ───────────────────────
 *   RESEND_API_KEY   — Resend API key for sending emails
 *   ANTHROPIC_API_KEY — Anthropic API key (used by other functions / chat)
 *
 * ── FLOW ───────────────────────────────────────────────────────────────────
 *   V1 form submitted → sends V2 link email
 *   V2 form submitted → sends dashboard access email
 *   Dashboard feedback / chat → logged only, no email response
 *   No email address → logged only
 */

// ── CORS headers ─────────────────────────────────────────────────────────────
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

  try {
    // Netlify outgoing webhooks send JSON; plain form posts send URL-encoded
    const contentType = req.headers.get("content-type") || "";
    let payload;

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const text = await req.text();
      payload = Object.fromEntries(new URLSearchParams(text));
    }

    // Netlify webhook payloads nest form fields under `data`
    // Plain form posts have fields at the top level
    const data = payload.data || payload;
    const formName = payload.form_name || payload["form-name"] || data["form-name"] || "";
    const email    = data.email || payload.email || "";

    console.log(`form-handler: received "${formName}", email: ${email || "none"}`);

    // No email — log only, nothing to send
    if (!email) {
      console.log("form-handler: no email address — logging only");
      return new Response(
        JSON.stringify({ status: "logged", note: "no email to respond to" }),
        { status: 200, headers: CORS }
      );
    }

    // ── Route by form name ─────────────────────────────────────────────────
    let emailSubject = "";
    let emailHtml    = "";
    let nextAction   = "";

    // V1 FORMS — send V2 link ───────────────────────────────────────────────
    if (formName === "sean-questionnaire") {
      emailSubject = "Hey Sean — round 2 is ready 🎬";
      nextAction   = "v2";
      emailHtml    = buildEmail({
        name:    "Sean",
        emoji:   "🎬",
        message: "Thanks for filling out the first round! We've already started researching Hot SEWP. A few more questions will help us build something really useful for you.",
        ctaText: "Go to Round 2",
        ctaUrl:  "https://getartdrop.com/q/sean2",
        footer:  "This takes about 5 minutes. Tap the mic and talk — way faster than typing.",
      });
    }
    else if (formName === "dan-questionnaire" || formName === "dan-v1") {
      emailSubject = "Hey Dan — round 2 is ready 🚗";
      nextAction   = "v2";
      emailHtml    = buildEmail({
        name:    "Dan",
        emoji:   "🚗",
        message: "Got your first answers — Scottsdale to Des Moines, nice. We're digging into the vehicle transport industry for you. A few more questions will help us figure out the best path for SelectDrive.",
        ctaText: "Go to Round 2",
        ctaUrl:  "https://getartdrop.com/q/dan2",
        footer:  "Tap the mic on your keyboard and just talk. 5 minutes.",
      });
    }
    else if (formName === "rachel-questionnaire") {
      emailSubject = "Hey! Quick follow-up 🌱";
      nextAction   = "v2";
      emailHtml    = buildEmail({
        name:    "Rachel",
        emoji:   "🌱",
        message: "Got your answers — genetics vocabulary IS tough for kids, and we found some grants you qualify for (Voya deadline is April 17!). A few more questions to help us build the best toolkit.",
        ctaText: "Go to Round 2",
        ctaUrl:  "https://getartdrop.com/q/rachel2",
        footer:  "This is quick — 5 minutes tops.",
      });
    }
    else if (formName === "dad-questionnaire") {
      emailSubject = "One more round, Dad 🎣";
      nextAction   = "v2";
      emailHtml    = buildEmail({
        name:    "Dad",
        emoji:   "🎣",
        message: "Got your answers — photography, genealogy, gardening, and Alaska on the bucket list. A few more questions so your kid can actually be useful.",
        ctaText: "Go to Round 2",
        ctaUrl:  "https://getartdrop.com/q/dad2",
        footer:  "Tap the mic and talk. Say as much as you want.",
      });
    }

    // V2 FORMS — send dashboard access ────────────────────────────────────────
    else if (formName === "sean-v2") {
      emailSubject = "Your dashboard is ready, Sean 🎬";
      nextAction   = "dashboard";
      emailHtml    = buildEmail({
        name:    "Sean",
        emoji:   "🎬",
        message: "We built your personalized Hot SEWP business dashboard. It's got everything — competitor analysis, pricing recommendations, content strategy, hiring roadmap, and a checklist to get you moving.",
        ctaText: "Open Your Dashboard",
        ctaUrl:  "https://getartdrop.com/c/sean",
        footer:  "Your access code is: hotsewp2026\n\nThis dashboard is private — only you can see it. It updates as you use it.",
      });
    }
    else if (formName === "dan-v2") {
      emailSubject = "Your dashboard is ready, Dan 🚗";
      nextAction   = "dashboard";
      emailHtml    = buildEmail({
        name:    "Dan",
        emoji:   "🚗",
        message: "Your SelectDrive business dashboard is built. Broker expansion plan, snowbird calendar, Marriott network strategy, competitor pricing — it's all in there.",
        ctaText: "Open Your Dashboard",
        ctaUrl:  "https://getartdrop.com/c/dan",
        footer:  "Your access code is: selectdrive2026\n\nPrivate dashboard — only you can see it.",
      });
    }
    else if (formName === "rachel-v2") {
      emailSubject = "Your dashboard is ready 🌱";
      nextAction   = "dashboard";
      emailHtml    = buildEmail({
        name:    "Rachel",
        emoji:   "🌱",
        message: "Your personalized teaching + plant business dashboard is built. Grant opportunities (Voya deadline April 17!), Canvas shortcuts, plant pricing guide, garden planning — all in one place.",
        ctaText: "Open Your Dashboard",
        ctaUrl:  "https://getartdrop.com/c/rachel",
        footer:  "Your access code is: merrill2026\n\nPrivate — only you can see it.",
      });
    }

    // DASHBOARD FEEDBACK / CHAT — log only, no reply ───────────────────────
    else if (
      formName.includes("dashboard-feedback") ||
      formName.includes("progress-sync") ||
      formName.includes("chat")
    ) {
      console.log(`form-handler: dashboard interaction logged — ${formName}`);
      return new Response(
        JSON.stringify({ status: "logged" }),
        { status: 200, headers: CORS }
      );
    }

    // ANY OTHER FORM — send generic auto-response ──────────────────────────
    else {
      // Extract the person's name from form data if available
      const personName = data.name || data["your-name"] || data["first-name"] || "";
      const firstName = personName ? personName.split(" ")[0] : "there";

      console.log(`form-handler: new form "${formName}" from ${firstName} (${email}) — sending auto-response`);

      emailSubject = `Got it${firstName !== "there" ? ", " + firstName : ""} — we're on it ✨`;
      nextAction = "auto-response";
      emailHtml = buildEmail({
        name: firstName,
        emoji: "✨",
        message: "We're on it RIGHT NOW. Your answers are being analyzed and your personalized dashboard is being built as you read this. Full audit of your online presence, competitor analysis, and recommendations tailored to your situation. You'll hear from us very soon — possibly before you finish your coffee.",
        ctaText: "See What We're Building",
        ctaUrl: "https://getartdrop.com/glow/",
        footer: "If we need a few more details, we'll send a quick follow-up. Reply to this email anytime.\n\nEverything you shared is confidential. We never sell your data.",
      });
    }

    // ── Send via Resend ────────────────────────────────────────────────────
    if (email && emailHtml) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method:  "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({
          from:    "Glow Up Works <hello@stanhattie.com>",
          to:      email,
          subject: emailSubject,
          html:    emailHtml,
        }),
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        console.error(`form-handler: Resend error for ${email}:`, JSON.stringify(resendData));
        return new Response(
          JSON.stringify({ status: "error", detail: resendData }),
          { status: 502, headers: CORS }
        );
      }

      console.log(`form-handler: email sent to ${email} (action: ${nextAction}) — id: ${resendData.id}`);

      return new Response(
        JSON.stringify({ status: "email_sent", to: email, action: nextAction, id: resendData.id }),
        { status: 200, headers: CORS }
      );
    }

    return new Response(
      JSON.stringify({ status: "processed" }),
      { status: 200, headers: CORS }
    );

  } catch (err) {
    console.error("form-handler: unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "Processing failed" }),
      { status: 500, headers: CORS }
    );
  }
}

// ── Email template ─────────────────────────────────────────────────────────
function buildEmail({ name, emoji, message, ctaText, ctaUrl, footer }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:500px;margin:40px auto;padding:32px 24px;">
    <div style="font-size:32px;margin-bottom:16px;">${emoji}</div>
    <h1 style="font-size:22px;color:#2d2a26;margin-bottom:16px;">Hey ${name}!</h1>
    <p style="font-size:15px;color:#5a5650;line-height:1.6;margin-bottom:24px;">${message}</p>
    <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;background:#e87da5;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">${ctaText}</a>
    <p style="font-size:13px;color:#8a8480;margin-top:24px;line-height:1.6;white-space:pre-line;">${footer}</p>
    <hr style="border:none;border-top:1px solid #e8e5e1;margin:32px 0 16px;">
    <p style="font-size:11px;color:#b0aca8;">
      Business Concierge by StanHattie LLC · Des Moines, Iowa<br>
      This email was sent because you filled out a questionnaire. Reply anytime.
    </p>
  </div>
</body>
</html>`;
}
