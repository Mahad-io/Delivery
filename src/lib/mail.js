'use strict';

const config = require('./config');

/**
 * Deliberately transport-agnostic. With no SMTP_URL configured (the default in
 * development) messages are written to the console, so nothing is ever sent to
 * a real address by accident while you are testing.
 *
 * To send for real, install nodemailer and replace `deliver`.
 */
async function deliver({ to, subject, text }) {
  if (!process.env.SMTP_URL) {
    console.log('\n----- email (not sent: SMTP_URL is not set) -----');
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log('------------------------------------------------\n');
    return { delivered: false, logged: true };
  }
  // Production wiring point. Keep it out of the request path if it gets slow.
  throw new Error('SMTP_URL is set but no transport is configured. See src/lib/mail.js.');
}

function verificationEmail(user, token) {
  const url = `${config.baseUrl}/verify?token=${encodeURIComponent(token)}`;
  return {
    to: user.email,
    subject: `Confirm your ${config.siteName} account`,
    text: [
      `Hello ${user.name},`,
      '',
      `Confirm your email address to finish setting up your ${config.siteName} account:`,
      url,
      '',
      'This link expires in 24 hours. If you did not create an account, ignore this email and nothing further will happen.',
      '',
      `${config.siteName} - ${config.baseUrl}`,
      `Privacy notice: ${config.baseUrl}/legal/privacy`
    ].join('\n')
  };
}

function resetEmail(user, token) {
  const url = `${config.baseUrl}/reset?token=${encodeURIComponent(token)}`;
  return {
    to: user.email,
    subject: `Reset your ${config.siteName} password`,
    text: [
      `Hello ${user.name},`,
      '',
      'Someone asked to reset the password on this account. If it was you, use this link:',
      url,
      '',
      'This link expires in one hour and can be used once.',
      'If it was not you, ignore this email. Your password has not changed.',
      '',
      `${config.siteName} - ${config.baseUrl}`
    ].join('\n')
  };
}

function dataExportEmail(user) {
  return {
    to: user.email,
    subject: `Your ${config.siteName} data export`,
    text: [
      `Hello ${user.name},`,
      '',
      'Your data export was generated and downloaded from your account page.',
      'If that was not you, change your password immediately and contact us.',
      '',
      `Contact: ${config.org.dpoEmail}`
    ].join('\n')
  };
}

function deletionConfirmationEmail(email, name) {
  return {
    to: email,
    subject: `Your ${config.siteName} account has been deleted`,
    text: [
      `Hello ${name},`,
      '',
      'Your account and all personal data associated with it have been permanently deleted.',
      '',
      'What we have kept, and why:',
      '- A one-way hash of your email address plus the date of deletion, as proof the request was honoured. This cannot be used to recover your email address.',
      '- Aggregate download counts with no link to any individual.',
      '',
      'Backups are rotated within 35 days, after which no copy of your data remains.',
      '',
      `If you believe this was done in error, contact ${config.org.dpoEmail}.`
    ].join('\n')
  };
}

module.exports = {
  deliver,
  verificationEmail,
  resetEmail,
  dataExportEmail,
  deletionConfirmationEmail
};
