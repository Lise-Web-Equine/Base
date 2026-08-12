import {Resend} from "resend";

/**
 * Route d'envoi du formulaire de contact.
 *
 * - Anti-spam : champ honeypot (`company`) + limitation de débit par IP.
 * - Envoi via Resend (clé + expéditeur/destinataire dans la config privée).
 * Les secrets ne sont jamais exposés au client (runtimeConfig privé).
 */

// Limitation de débit best-effort (en mémoire). Note : réinitialisée au
// redémarrage et non partagée entre instances — suffisant contre le spam basique.
const WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody<{
    firstName?: string;
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    consent?: boolean;
    company?: string; // honeypot (doit rester vide)
  }>(event);

  // Honeypot : un bot remplit ce champ caché → on renvoie un succès factice.
  if (body?.company) {
    return {ok: true};
  }

  const firstName = (body?.firstName ?? "").trim();
  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim();
  const phone = (body?.phone ?? "").trim();
  const subject = (body?.subject ?? "").trim();
  const message = (body?.message ?? "").trim();

  if (!firstName || !name || !isEmail(email) || !subject || message.length < 10) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Merci de renseigner votre prénom, nom, un email valide, un sujet et un message.",
    });
  }

  if (!body?.consent) {
    throw createError({
      statusCode: 400,
      statusMessage: "Merci d'accepter l'utilisation de vos données pour être recontacté.",
    });
  }

  const ip = getRequestIP(event, {xForwardedFor: true}) || "unknown";
  if (isRateLimited(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: "Trop de tentatives. Réessayez dans quelques minutes.",
    });
  }

  if (!config.resendApiKey || !config.contactTo || !config.contactFrom) {
    throw createError({
      statusCode: 500,
      statusMessage: "Le service d'envoi n'est pas configuré.",
    });
  }

  const resend = new Resend(config.resendApiKey as string);
  const {error} = await resend.emails.send({
    from: config.contactFrom as string,
    to: config.contactTo as string,
    replyTo: email,
    subject: `Nouveau message : ${subject}`,
    text: [
      `Prénom : ${firstName}`,
      `Nom : ${name}`,
      `Email : ${email}`,
      `Téléphone : ${phone || "—"}`,
      `Sujet : ${subject}`,
      "",
      message,
      "",
      "Consentement RGPD : accepté",
    ].join("\n"),
  });

  if (error) {
    console.error("Resend error:", error);
    throw createError({
      statusCode: 502,
      statusMessage: "L'envoi a échoué. Réessayez plus tard.",
    });
  }

  return {ok: true};
});
