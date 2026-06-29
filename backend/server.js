const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
const axios = require('axios'); // 🚀 Secure HTTPS network connection tool
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🚀 MANDATORY FOR RENDER: Instructs Express to trust the proxy layer 
// so user IP address mapping calculations match up accurately.
app.set('trust proxy', true);

// --- RESEND CONFIGURATION ---
const resend = new Resend(process.env.RESEND_API_KEY);

// --- MIDDLEWARE CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Cross-Origin Request Blocked by Security Policies.'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

// --- GLOBAL IP FIREWALL BLACKLIST MIDDLEWARE ---
// 🚀 DYNAMIC CURE: Unpacks your comma-separated string variables straight out of environment memory!
app.use((req, res, next) => {
    const visitorIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Read string from env, default to empty string if not set, and split into an active array
    const rawBannedIPs = process.env.BANNED_IPS || '';
    const bannedIPsArray = rawBannedIPs.split(',').map(ip => ip.trim()).filter(Boolean);

    // If the visitor matches your blacklist memory filters, boot them instantly!
    if (bannedIPsArray.includes(visitorIP)) {
        console.warn(`🛑 SECURITY BLOCK: Terminated request from blacklisted IP: ${visitorIP}`);
        return res.status(403).json({
            error: 'Access Denied. Your IP address has been permanently blacklisted due to security policy violations.'
        });
    }

    next();
});

// --- SECURE MAIL TRANSMISSION ROUTE ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // 1. Initial sanitization length validation bounds check
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are strictly required.' });
    }

    if (name.trim().length < 4 || name.length > 25) {
        return res.status(400).json({ error: 'Name must be between 4 and 25 characters long.' });
    }

    if (message.trim().length < 10) {
        return res.status(400).json({ error: 'Please enter a more descriptive message (minimum 10 characters).' });
    }

    // Stable regex fallback structure 
    const fallbackRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    try {
        // 2. Outsource validation parameters to Abstract API over secure HTTPS
        const verificationUrl = `https://abstractapi.com{process.env.ABSTRACT_API_KEY}&email=${email}`;
        const verificationResponse = await axios.get(verificationUrl);

        // Destructure the flat keys directly from Abstract API's JSON response root
        const { is_valid_format, is_disposable_email, deliverability } = verificationResponse.data;

        // Validation Check A: Verify format syntax flag
        if (is_valid_format === false) {
            return res.status(400).json({ error: 'Please enter a valid email address format structure.' });
        }

        // Validation Check B: Block throwaway temporary spam mail accounts
        if (is_disposable_email === true) {
            return res.status(400).json({ error: 'Disposable or temporary email generators are fully blocked.' });
        }

        // Validation Check C: Mailbox existence verification check
        if (deliverability === 'UNDELIVERABLE') {
            return res.status(400).json({ error: 'This email account does not exist. Please enter a real email.' });
        }

    } catch (apiErr) {
        // CRITICAL RESILIENCE FALLBACK: If your Abstract API 500 free monthly quota limits run out,
        // your server bypasses the block, relies on the backup syntax check, and delivers the message anyway!
        console.warn('Abstract API threshold or network issue. Executing regex backup validation layer:', apiErr.message);

        if (!fallbackRegex.test(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address format structure.' });
        }
    }

    // 3. Capture visitor IP address safely after all checkpoints pass successfully
    const viewerIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // 4. Secure Mail dispatch template execution via Resend
        const { data, error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>', // Free tier Resend sender domain
            to: process.env.EMAIL_USER,                       // Your personal receiving Gmail inbox address
            replyTo: email,                                   // Direct replies route cleanly back to your visitor
            subject: `New Portfolio Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f7; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                        <h2 style="color: #3b82f6; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top:0;">Portfolio Transmission Received</h2>
                        <p style="margin: 15px 0;"><strong>Sender Name:</strong> ${name}</p>
                        <p style="margin: 15px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p style="margin: 15px 0;"><strong>Viewer IP Address:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${viewerIP}</span></p>
                        <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; font-style: italic;">
                            "${message.replace(/\n/g, '<br>')}"
                        </div>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                            Sent securely from your portfolio ingestion Resend HTTPS API with Abstract validation.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Resend Transmission Failure Error:', error);
            return res.status(500).json({ error: 'Failed to dispatch notification mail.' });
        }

        return res.status(200).json({ success: 'Message dispatched securely!' });

    } catch (err) {
        console.error('Mail service delivery error details:', err.message);
        return res.status(500).json({ error: 'Internal server error processing mail transmission.' });
    }
});

app.listen(PORT, () => {
    console.log(`Portfolio API engine actively operating on port ${PORT} with Resend & Abstract API`);
});
