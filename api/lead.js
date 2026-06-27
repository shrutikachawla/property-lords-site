// Vercel serverless function — receives lead form submissions from the React
// site and forwards them to Follow Up Boss via POST /v1/events, which is the
// only correct way to send leads in (the /people endpoint won't trigger
// automations and can create duplicate contacts).
//
// Required environment variables (set these in the Vercel dashboard,
// Project Settings -> Environment Variables — never commit them to git):
//   FUB_API_KEY      Your Follow Up Boss API key (Admin -> API in FUB)
//   FUB_SYSTEM_NAME  The system name you registered with FUB (see README)
//   FUB_SYSTEM_KEY   The system key FUB issued you after registration
//   SITE_DOMAIN      Your domain, e.g. "propertylords.com" (used as "source")

const FUB_EVENTS_URL = "https://api.followupboss.com/v1/events";

// Map our internal form "type" values to the event types FUB recognizes.
// Only these types reliably trigger action plans / automations in FUB.
const ALLOWED_TYPES = new Set([
  "General Inquiry",
  "Property Inquiry",
  "Seller Inquiry",
  "Registration",
  "Visited Open House",
]);

function splitName(fullName = "") {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts.shift() || "";
  const lastName = parts.join(" ");
  return { firstName, lastName };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { FUB_API_KEY, FUB_SYSTEM_NAME, FUB_SYSTEM_KEY, SITE_DOMAIN } = process.env;

  if (!FUB_API_KEY || !FUB_SYSTEM_NAME || !FUB_SYSTEM_KEY) {
    console.error("Missing Follow Up Boss environment variables");
    return res.status(500).json({ error: "Server is not configured for lead delivery yet." });
  }

  try {
    const {
      firstName,
      lastName,
      fullName,
      email,
      phone,
      message,
      type = "General Inquiry",
      source,
      property, // optional: { address, price, mlsNumber, url }
    } = req.body || {};

    if (!email && !phone) {
      return res.status(400).json({ error: "An email or phone number is required." });
    }

    const names = fullName ? splitName(fullName) : { firstName, lastName };

    if (!names.firstName) {
      return res.status(400).json({ error: "Name is required." });
    }

    const eventType = ALLOWED_TYPES.has(type) ? type : "General Inquiry";

    const person = {
      firstName: names.firstName,
      lastName: names.lastName || "",
    };
    if (email) person.emails = [{ value: email }];
    if (phone) person.phones = [{ value: phone }];

    const body = {
      source: source || SITE_DOMAIN || "website",
      system: FUB_SYSTEM_NAME,
      type: eventType,
      message: message || "",
      person,
    };

    if (property) body.property = property;

    const fubRes = await fetch(FUB_EVENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${FUB_API_KEY}:`).toString("base64")}`,
        "X-System": FUB_SYSTEM_NAME,
        "X-System-Key": FUB_SYSTEM_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!fubRes.ok) {
      const errText = await fubRes.text().catch(() => "");
      console.error("Follow Up Boss error:", fubRes.status, errText);
      return res.status(502).json({ error: "Could not reach our CRM. Please try again shortly." });
    }

    const data = await fubRes.json().catch(() => ({}));
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error("Lead handler error:", err);
    return res.status(500).json({ error: "Unexpected server error." });
  }
}
