export interface EmailVerificationTemplateContext {
    name: string;
    verificationUrl: string;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function renderEmailVerificationTemplate({
    name,
    verificationUrl,
}: EmailVerificationTemplateContext): string {
    const safeName = escapeHtml(name);
    const safeVerificationUrl = escapeHtml(verificationUrl);

    return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Verify your email</title>
            </head>
            <body style="margin:0;background:#f5f7fb;color:#172033;font-family:Arial,Helvetica,sans-serif;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:32px 16px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e9f2;border-radius:8px;overflow:hidden;">
                                <tr>
                                    <td style="padding:28px 32px 12px;">
                                        <h1 style="margin:0;font-size:24px;line-height:32px;color:#111827;">Verify your email</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:0 32px 24px;font-size:16px;line-height:24px;color:#374151;">
                                        <p style="margin:0 0 16px;">Hi ${safeName},</p>
                                        <p style="margin:0 0 24px;">Welcome to Drop Box. Confirm your email address to finish setting up your account.</p>
                                        <a href="${safeVerificationUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;border-radius:6px;padding:12px 18px;">Verify email</a>
                                        <p style="margin:24px 0 0;font-size:14px;line-height:20px;color:#6b7280;">This link expires in 1 hour. If you did not create an account, you can ignore this email.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}
