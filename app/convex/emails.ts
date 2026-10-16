"use node";

import { internalAction, action, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import nodemailer from "nodemailer";

// Helper to get SMTP transporter using Google Workspace settings
function getTransporter() {
  const host = process.env.GOOGLE_WORKSPACE_SMTP_HOST || process.env.SMTP_HOST || "smtp-relay.gmail.com";
  const portStr = process.env.GOOGLE_WORKSPACE_SMTP_PORT || process.env.SMTP_PORT || "587";
  const user = process.env.GOOGLE_WORKSPACE_SMTP_USER || process.env.SMTP_USER || "selim@zackisch.com";
  const pass = process.env.GOOGLE_WORKSPACE_SMTP_APP_PASSWORD || process.env.SMTP_PASS;

  if (!pass) {
    throw new Error("Missing required SMTP password (GOOGLE_WORKSPACE_SMTP_APP_PASSWORD or SMTP_PASS)");
  }

  const port = Number(portStr);
  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user, pass },
    }),
    user,
    senderEmail: process.env.GOOGLE_WORKSPACE_SMTP_FROM || process.env.EMAIL_FROM || "noreply@zackisch.com",
    replyToEmail: process.env.GOOGLE_WORKSPACE_SMTP_REPLY_TO || process.env.EMAIL_REPLY_TO || "noreply@zackisch.com",
  };
}

async function sendMail({
  to,
  subject,
  html,
  text,
  locale,
  listUnsubscribe,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  locale?: string;
  listUnsubscribe?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { transporter, user, senderEmail, replyToEmail } = getTransporter();
    const senderName = "Zackisch";
    const fromHeader = `"${senderName}" <${senderEmail}>`;

    const headers: Record<string, string> = {};
    if (listUnsubscribe) {
      headers["List-Unsubscribe"] = `<${listUnsubscribe}>`;
      headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }

    await transporter.sendMail({
      from: fromHeader,
      replyTo: replyToEmail,
      envelope: {
        from: senderEmail,
        to,
      },
      to,
      subject,
      html,
      text: text || subject,
      headers,
    });
    return { success: true };
  } catch (err: any) {
    console.error("Failed to send email via Google Workspace SMTP:", err);
    return { success: false, error: err?.message || String(err) };
  }
}

// 1. Send Email OTP (Sign-in, Email Change)
export const sendEmailOtp = internalAction({
  args: {
    to: v.string(),
    code: v.string(),
    locale: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const isDe = args.locale !== "en";
    const isEmailChange = args.type === "email_change";
    const isOpsLogin = args.type === "ops_login";

    const subject = isOpsLogin
      ? isDe
        ? "Sicherheitscode für Zackisch Team Dashboard"
        : "Security code for Zackisch Team Dashboard"
      : isEmailChange
      ? isDe
        ? "E-Mail-Adresse ändern für Zackisch"
        : "Change email address for Zackisch"
      : isDe
      ? "Anmeldecode für Zackisch"
      : "Sign-in code for Zackisch";

    const title = isOpsLogin
      ? isDe
        ? "Zackisch Team Dashboard — Zwei-Faktor-Code"
        : "Zackisch Team Dashboard — Two-Factor Code"
      : subject;

    const intro = isOpsLogin
      ? isDe
        ? "Verwende den folgenden 6-stelligen Sicherheitscode, um deine Anmeldung im Team Dashboard (internal.zackisch.com) abzuschließen. Der Code ist 15 Minuten gültig."
        : "Use the following 6-digit security code to complete your login to the Team Dashboard (internal.zackisch.com). The code is valid for 15 minutes."
      : isEmailChange
      ? isDe
        ? "Verwende den folgenden Code, um die Änderung deiner E-Mail-Adresse zu bestätigen. Der Code ist 30 Minuten gültig."
        : "Use the following code to confirm your email address change. The code is valid for 30 minutes."
      : isDe
      ? "Verwende den folgenden Code, um deine Anmeldung zu bestätigen. Der Code ist 30 Minuten gültig."
      : "Use the following code to confirm your sign-in. The code is valid for 30 minutes.";

    const hint1 = isDe
      ? "Bitte gib diesen Code in dem geöffneten Browserfenster ein, um fortzufahren. Teile diesen Code niemals mit anderen Personen."
      : "Please enter this code in the open browser window to proceed. Never share this code with anyone.";
    const hint2 = isDe
      ? "Falls du diesen Code nicht angefordert hast, ändere bitte unverzüglich dein Passwort und informiere die Sicherheitsadministration."
      : "If you did not request this code, please change your password immediately and notify security administration.";

    const footerText = isDe
      ? 'Diese E-Mail wurde automatisch von <a href="https://zackisch.com" style="color: #000000; text-decoration: underline; font-weight: 600;">zackisch.com</a> gesendet.<br/>Bitte antworte nicht auf diese E-Mail.'
      : 'This email was automatically sent by <a href="https://zackisch.com" style="color: #000000; text-decoration: underline; font-weight: 600;">zackisch.com</a>.<br/>Please do not reply to this email.';

    const html = `<!DOCTYPE html>
<html>
<head>
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Inter:wght@700;800&display=swap');

@media only screen and (max-width: 480px) {
  .email-wrapper { padding: 24px 12px !important; }
  .email-card { border-radius: 20px !important; }
  .email-header { padding: 24px 24px 20px !important; }
  .email-body { padding: 28px 16px !important; }
  .email-title { font-size: 20px !important; margin-bottom: 10px !important; }
  .email-intro { font-size: 14px !important; margin-bottom: 24px !important; }
  .otp-box { padding: 20px 12px !important; border-radius: 14px !important; margin-bottom: 24px !important; }
  .otp-code { font-size: 32px !important; letter-spacing: 16px !important; padding-left: 16px !important; }
  .email-footer { padding: 20px 20px !important; }
}
</style>
</head>
<body style="margin: 0; padding: 0;">
<div class="email-wrapper" style="font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; padding: 40px 16px;">
  <div class="email-card" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div class="email-header" style="padding: 32px 40px 24px; border-bottom: 1px solid #f4f4f5;">
      <a href="https://zackisch.com" style="display: inline-block; text-decoration: none;">
        <img src="https://zackisch.com/combination_mark.svg" alt="Zackisch" style="height: 40px; width: auto; display: block;" />
      </a>
    </div>
    <div class="email-body" style="padding: 40px;">
      <h1 class="email-title" style="margin: 0 0 12px; font-size: 24px; font-weight: 800; color: #000000; letter-spacing: -0.5px;">${title}</h1>
      <p class="email-intro" style="margin: 0 0 32px; font-size: 15px; color: #71717a; line-height: 1.6;">${intro}</p>
      <div class="otp-box" style="background-color: #000000; border-radius: 16px; padding: 24px 16px; text-align: center; margin-bottom: 28px;">
        <p class="otp-code" style="margin: 0; font-family: 'Inter', 'Poppins', sans-serif; font-size: 44px; font-weight: 800; letter-spacing: 24px; padding-left: 24px; color: #ffffff; white-space: nowrap; line-height: 1.2;">${args.code}</p>
      </div>
      <p style="margin: 0 0 8px; font-size: 14px; color: #71717a; line-height: 1.6;">${hint1}</p>
      <p style="margin: 0; font-size: 14px; color: #71717a; line-height: 1.6;">${hint2}</p>
    </div>
    <div class="email-footer" style="padding: 24px 40px; border-top: 1px solid #f4f4f5; background-color: #fafafa;">
      <p style="margin: 0; font-size: 13px; color: #a1a1aa; line-height: 1.6; text-align: center;">
        ${footerText}
      </p>
    </div>
  </div>
</div>
</body>
</html>`;

    const res = await sendMail({
      to: args.to,
      subject,
      html,
      text: `${subject}: ${args.code}`,
      locale: args.locale,
    });

    await ctx.runMutation(internal.emailLogs.logEmailRecord, {
      recipient: args.to,
      type: isOpsLogin ? "ops_otp" : "otp",
      subject,
      status: res.success ? "sent" : "failed",
      error: res.error,
      regionId: "de",
    });

    return res.success;
  },
});

// 2. Send Password Reset Email
export const sendPasswordResetEmail = internalAction({
  args: {
    to: v.string(),
    resetUrl: v.string(),
    userName: v.optional(v.string()),
    locale: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const isDe = args.locale !== "en";
    const subject = isDe ? "Passwort zurücksetzen für Zackisch" : "Reset password for Zackisch";
    const greeting = isDe
      ? `Hallo${args.userName ? " " + args.userName : ""}, klicke auf die folgende Schaltfläche, um dein Passwort zurückzusetzen. Dieser Link ist 30 Minuten gültig.`
      : `Hello${args.userName ? " " + args.userName : ""}, click the button below to reset your password. This link is valid for 30 minutes.`;
    const btnText = isDe ? "Passwort zurücksetzen" : "Reset Password";
    const footerText = isDe
      ? 'Diese E-Mail wurde automatisch von <a href="https://zackisch.com" style="color: #000000; text-decoration: underline; font-weight: 600;">zackisch.com</a> gesendet.<br/>Bitte antworte nicht auf diese E-Mail.'
      : 'This email was automatically sent by <a href="https://zackisch.com" style="color: #000000; text-decoration: underline; font-weight: 600;">zackisch.com</a>.<br/>Please do not reply to this email.';

    const html = `<!DOCTYPE html>
<html>
<head>
<meta name="color-scheme" content="light">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
</style>
</head>
<body style="margin: 0; padding: 0;">
<div style="font-family: 'Poppins', sans-serif; background-color: #f4f4f5; padding: 40px 16px;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="padding: 32px 40px 24px; border-bottom: 1px solid #f4f4f5;">
      <a href="https://zackisch.com" style="display: inline-block; text-decoration: none;">
        <img src="https://zackisch.com/combination_mark.svg" alt="Zackisch" style="height: 40px; width: auto; display: block;" />
      </a>
    </div>
    <div style="padding: 40px;">
      <h1 style="margin: 0 0 12px; font-size: 24px; font-weight: 800; color: #000000; letter-spacing: -0.5px;">${subject}</h1>
      <p style="margin: 0 0 32px; font-size: 15px; color: #71717a; line-height: 1.6;">${greeting}</p>
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${args.resetUrl}" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 16px 32px; border-radius: 12px;">${btnText}</a>
      </div>
      <p style="margin: 0; font-size: 14px; color: #71717a; line-height: 1.6;">${args.resetUrl}</p>
    </div>
    <div style="padding: 24px 40px; border-top: 1px solid #f4f4f5; background-color: #fafafa;">
      <p style="margin: 0; font-size: 13px; color: #a1a1aa; line-height: 1.6; text-align: center;">${footerText}</p>
    </div>
  </div>
</div>
</body>
</html>`;

    const res = await sendMail({
      to: args.to,
      subject,
      html,
      text: `${subject}: ${args.resetUrl}`,
      locale: args.locale,
    });

    await ctx.runMutation(internal.emailLogs.logEmailRecord, {
      recipient: args.to,
      type: "otp",
      subject,
      status: res.success ? "sent" : "failed",
      error: res.error,
      regionId: "de",
    });

    return res.success;
  },
});

// 3. Send Delete Account Email
export const sendDeleteAccountEmail = internalAction({
  args: {
    to: v.string(),
    deleteUrl: v.string(),
    locale: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const isDe = args.locale !== "en";
    const subject = isDe ? "Konto löschen für Zackisch" : "Delete account for Zackisch";
    const intro = isDe
      ? "Bitte klicke auf die folgende Schaltfläche, um dein Konto bei Zackisch endgültig zu löschen. Dieser Link ist 30 Minuten gültig."
      : "Please click the button below to permanently delete your Zackisch account. This link is valid for 30 minutes.";
    const btnText = isDe ? "Konto unwiderruflich löschen" : "Delete account permanently";

    const html = `<!DOCTYPE html>
<html>
<head><meta name="color-scheme" content="light"></head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', sans-serif; background-color: #f4f4f5; padding: 40px 16px;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px;">
    <img src="https://zackisch.com/combination_mark.svg" alt="Zackisch" style="height: 40px; margin-bottom: 24px;" />
    <h1 style="font-size: 24px; font-weight: 800; color: #000;">${subject}</h1>
    <p style="color: #71717a; line-height: 1.6;">${intro}</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${args.deleteUrl}" style="background-color: #dc2626; color: #fff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; display: inline-block;">${btnText}</a>
    </div>
  </div>
</body>
</html>`;

    const res = await sendMail({
      to: args.to,
      subject,
      html,
      text: `${subject}: ${args.deleteUrl}`,
      locale: args.locale,
    });

    await ctx.runMutation(internal.emailLogs.logEmailRecord, {
      recipient: args.to,
      type: "otp",
      subject,
      status: res.success ? "sent" : "failed",
      error: res.error,
      regionId: "de",
    });

    return res.success;
  },
});

// 4. Send Change Email Link
export const sendChangeEmailLink = internalAction({
  args: {
    to: v.string(),
    changeUrl: v.string(),
    locale: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const isDe = args.locale !== "en";
    const subject = isDe ? "E-Mail-Adresse ändern für Zackisch" : "Change email address for Zackisch";
    const intro = isDe
      ? "Bitte klicke auf die folgende Schaltfläche, um die Änderung deiner E-Mail-Adresse bei Zackisch zu bestätigen."
      : "Please click the button below to confirm your new email address for Zackisch.";
    const btnText = isDe ? "E-Mail-Adresse ändern" : "Change email address";

    const html = `<!DOCTYPE html>
<html>
<head><meta name="color-scheme" content="light"></head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', sans-serif; background-color: #f4f4f5; padding: 40px 16px;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px;">
    <img src="https://zackisch.com/combination_mark.svg" alt="Zackisch" style="height: 40px; margin-bottom: 24px;" />
    <h1 style="font-size: 24px; font-weight: 800; color: #000;">${subject}</h1>
    <p style="color: #71717a; line-height: 1.6;">${intro}</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${args.changeUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; display: inline-block;">${btnText}</a>
    </div>
  </div>
</body>
</html>`;

    const res = await sendMail({
      to: args.to,
      subject,
      html,
      text: `${subject}: ${args.changeUrl}`,
      locale: args.locale,
    });

    await ctx.runMutation(internal.emailLogs.logEmailRecord, {
      recipient: args.to,
      type: "otp",
      subject,
      status: res.success ? "sent" : "failed",
      error: res.error,
      regionId: "de",
    });

    return res.success;
  },
});

// 5. Send Newsletter Confirmation Email (Double Opt-In)
export const sendNewsletterConfirmationEmail = internalAction({
  args: {
    to: v.string(),
    token: v.string(),
    locale: v.string(),
    regionId: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const isDe = args.locale !== "en";
    const confirmUrl = `https://zackisch.com/${args.regionId}-${args.locale}/newsletter/confirm?token=${args.token}`;
    const subject = isDe
      ? "Bitte bestätige deine Anmeldung zum Zackisch Newsletter"
      : "Please confirm your Zackisch newsletter subscription";

    const title = isDe ? "Fast geschafft!" : "Almost there!";
    const intro = isDe
      ? "Vielen Dank für dein Interesse an Zackisch. Bitte bestätige deine E-Mail-Adresse, um aktuelle Neuigkeiten, Updates und Gastronomie-Einblicke zu erhalten."
      : "Thank you for your interest in Zackisch. Please confirm your email address to receive product updates, news, and gastronomy insights.";
    const btnText = isDe ? "Anmeldung bestätigen" : "Confirm subscription";
    const ignoreText = isDe
      ? "Falls du dich nicht für den Newsletter eingetragen hast, ignoriere diese E-Mail einfach."
      : "If you did not sign up for the newsletter, you can safely ignore this email.";

    const html = `<!DOCTYPE html>
<html>
<head><meta name="color-scheme" content="light"></head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', sans-serif; background-color: #f4f4f5; padding: 40px 16px;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <img src="https://zackisch.com/combination_mark.svg" alt="Zackisch" style="height: 40px; margin-bottom: 24px;" />
    <h1 style="font-size: 24px; font-weight: 800; color: #000; margin-bottom: 12px;">${title}</h1>
    <p style="color: #71717a; line-height: 1.6; margin-bottom: 32px;">${intro}</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${confirmUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 16px 32px; border-radius: 9999px; font-weight: 600; display: inline-block;">${btnText}</a>
    </div>
    <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6;">${ignoreText}</p>
  </div>
</body>
</html>`;

    const res = await sendMail({
      to: args.to,
      subject,
      html,
      text: `${subject}: ${confirmUrl}`,
      locale: args.locale,
    });

    await ctx.runMutation(internal.emailLogs.logEmailRecord, {
      recipient: args.to,
      type: "newsletter",
      subject,
      status: res.success ? "sent" : "failed",
      error: res.error,
      regionId: args.regionId,
    });

    return res.success;
  },
});

// 6. Send Newsletter Campaign to Subscribers
export const sendNewsletterBatch = action({
  args: {
    campaignId: v.id("newsletterCampaigns"),
    subject: v.string(),
    htmlContent: v.string(),
    textContent: v.string(),
    regionId: v.string(),
    actorEmail: v.string(),
  },
  returns: v.object({
    sentCount: v.number(),
    failedCount: v.number(),
  }),
  handler: async (ctx, args) => {
    // 1. Fetch confirmed subscribers in region
    const subscribers: any[] = await ctx.runQuery(internal.emailLogs.getConfirmedSubscribersForCampaign, {
      regionId: args.regionId,
    });

    let sentCount = 0;
    let failedCount = 0;

    for (const sub of subscribers) {
      const unsubscribeUrl = `https://zackisch.com/${args.regionId}-${sub.locale}/newsletter/unsubscribe?token=${sub.doubleOptInToken}`;
      const footerHtml = `
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #888888; text-align: center;">
          <p style="margin: 0 0 8px;">Zackisch · zackisch.com</p>
          <p style="margin: 0;">
            <a href="${unsubscribeUrl}" style="color: #666666; text-decoration: underline;">Newsletter abmelden / Unsubscribe</a>
          </p>
        </div>
      `;

      const fullHtml = args.htmlContent + footerHtml;

      const res = await sendMail({
        to: sub.email,
        subject: args.subject,
        html: fullHtml,
        text: args.textContent + `\n\nAbmelden: ${unsubscribeUrl}`,
        listUnsubscribe: unsubscribeUrl,
      });

      if (res.success) {
        sentCount++;
      } else {
        failedCount++;
      }

      await ctx.runMutation(internal.emailLogs.logEmailRecord, {
        recipient: sub.email,
        type: "newsletter",
        subject: args.subject,
        status: res.success ? "sent" : "failed",
        error: res.error,
        regionId: args.regionId,
        campaignId: args.campaignId,
      });

      // Small throttling delay to stay well within Google Workspace SMTP limits
      await new Promise((resolve) => setTimeout(resolve, 60));
    }

    // Update campaign status
    await ctx.runMutation(internal.emailLogs.updateCampaignSentStats, {
      campaignId: args.campaignId,
      deliveredCount: sentCount,
      failedCount,
    });

    return { sentCount, failedCount };
  },
});

// 7. Verify SMTP Connection Test Action
export const testSmtpConnection = action({
  args: { testRecipient: v.string() },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      const { transporter } = getTransporter();
      await transporter.verify();

      const res = await sendMail({
        to: args.testRecipient,
        subject: "Zackisch SMTP Testnachricht",
        html: "<p>Google Workspace SMTP Verbindung von Zackisch erfolgreich verifiziert!</p>",
        text: "Google Workspace SMTP Verbindung von Zackisch erfolgreich verifiziert!",
      });

      await ctx.runMutation(internal.emailLogs.logEmailRecord, {
        recipient: args.testRecipient,
        type: "test",
        subject: "Zackisch SMTP Testnachricht",
        status: res.success ? "sent" : "failed",
        error: res.error,
        regionId: "de",
      });

      return {
        success: res.success,
        message: res.success
          ? "SMTP-Verbindung und Testnachricht erfolgreich übermittelt."
          : `SMTP-Fehler: ${res.error}`,
      };
    } catch (err: any) {
      return { success: false, message: `SMTP-Fehler: ${err?.message || String(err)}` };
    }
  },
});
