import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

/**
 * EmailJS integration — sends the contact receipt email directly from the
 * browser through your own Gmail account. No custom sender domain needed.
 *
 * Sign up free at https://www.emailjs.com, connect your Gmail service, create
 * an email template, then add these three values to your .env:
 *   VITE_EMAILJS_SERVICE_ID
 *   VITE_EMAILJS_TEMPLATE_ID
 *   VITE_EMAILJS_PUBLIC_KEY
 *
 * The Public Key is designed by EmailJS to be safe in client-side code
 * (rate-limited, no account access beyond sending the template).
 */

export interface ContactEmailParams {
  reference: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  /** Absolute URL the recipient can click to re-open the contact page / download a receipt */
  replyUrl?: string;
}

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export const isEmailConfigured = (): boolean =>
  Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

/**
 * Send the contact receipt email via EmailJS. Resolves to `true` on success,
 * `false` on a soft failure (misconfiguration / network) — the caller should
 * never throw to the user, just fall back to the in-app PDF receipt.
 */
export const sendContactEmail = async (
  data: ContactEmailParams,
): Promise<{ success: boolean; message?: string }> => {
  if (!isEmailConfigured()) {
    return {
      success: false,
      message: 'EmailJS is not configured — add your Service ID, Template ID and Public Key.',
    };
  }

  const params = {
    to_email: data.email,
    to_name: data.name,
    from_name: 'SoundWave Support',
    reference: data.reference,
    name: data.name,
    email: data.email,
    phone: data.phone || 'Not provided',
    subject: data.subject,
    message: data.message,
    created_at: data.createdAt,
    reply_url: data.replyUrl || (typeof window !== 'undefined' ? window.location.origin : ''),
  };

  try {
    await emailjs.send(SERVICE_ID!, TEMPLATE_ID!, params, { publicKey: PUBLIC_KEY! });
    return { success: true };
  } catch (err) {
    const status = err as EmailJSResponseStatus;
    console.error('EmailJS send failed:', status?.status, status?.text, err);
    return {
      success: false,
      message: `Email send failed (${status?.status ?? 'unknown'}). The receipt PDF is still available to download.`,
    };
  }
};
