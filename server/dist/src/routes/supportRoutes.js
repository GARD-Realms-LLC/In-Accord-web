"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = (0, express_1.Router)();
router.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, subject, message } = req.body;
        console.log('[Support] Received email request:', { name, email, subject, message });
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const toEmail = process.env.SUPPORT_TO_EMAIL || process.env.SMTP_TO;
        if (smtpHost && smtpUser && smtpPass && toEmail) {
            const transporter = nodemailer_1.default.createTransport({
                host: smtpHost,
                port: smtpPort || 587,
                secure: smtpPort === 465,
                auth: { user: smtpUser, pass: smtpPass }
            });
            const info = yield transporter.sendMail({
                from: `${name} <${email}>`,
                to: toEmail,
                subject: subject || 'Support request from In-Accord',
                text: message || '',
                html: `<p>${message || ''}</p><p>From: ${name} &lt;${email}&gt;</p>`
            });
            console.log('[Support] Email sent via SMTP:', info.messageId);
            return res.status(200).json({ ok: true, sent: true, id: info.messageId });
        }
        // Fallback: mock queue
        console.log('[Support] SMTP not configured, queued (mock).');
        return res.status(200).json({ ok: true, queued: true });
    }
    catch (err) {
        console.error('[Support] Error handling send:', err);
        return res.status(500).json({ ok: false, error: String(err) });
    }
}));
exports.default = router;
