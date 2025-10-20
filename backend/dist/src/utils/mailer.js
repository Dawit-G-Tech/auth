"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter = null;
function getTransporter() {
    if (transporter)
        return transporter;
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
        throw new Error('SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, SMTP_PASS');
    }
    transporter = nodemailer_1.default.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
    return transporter;
}
async function sendMail(params) {
    const mailFrom = process.env.MAIL_FROM || 'no-reply@example.com';
    const tx = getTransporter();
    await tx.sendMail({
        from: mailFrom,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
    });
}
async function sendPasswordResetEmail({ to, resetUrl }) {
    const subject = 'Reset your password';
    const html = `
		<p>You requested to reset your password.</p>
		<p>Click the link below to set a new password:</p>
		<p><a href="${resetUrl}">Reset Password</a></p>
		<p>If you did not request this, please ignore this email.</p>
	`;
    await sendMail({ to, subject, html });
}
