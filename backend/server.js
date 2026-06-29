const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', true);

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "https://abstractapi.com", "https://resend.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://resend.com"],
        },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// --- RESEND EMAIL UTILITY INITIALISATION ---
const resend = new Resend(process.env.RESEND_API_KEY);

// --- MIDDLEWARE OVERRIDE CONFIGURATION ---
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

// --- 🚀 SECURITY LAYER 1: GLOBAL ENVIRONMENT IP FIREWALL ---
app.use((req, res, next) => {
    const visitorIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const rawBannedIPs = process.env.BANNED_IPS || '';
    const bannedIPsArray = rawBannedIPs.split(',').map(ip => ip.trim()).filter(Boolean);

    if (bannedIPsArray.includes(visitorIP)) {
        console.warn(`🛑 SECURITY BLOCK: Terminated request from blacklisted IP: ${visitorIP}`);
        return res.status(403).json({
            error: 'Access Denied. Your IP address has been permanently blacklisted due to security policy violations.'
        });
    }
    next();
});

// --- 🚀 SECURITY LAYER 2: API SUBMISSION RATE LIMITER ---
const contactFormLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // ⏳ 1 Hour window tracker parameters
    max: 3,                   // 🛑 Limit each IP address to exactly 3 attempts per hour
    message: {
        error: 'Too many submission requests detected from your network origin. Please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// --- 🚀 SECURITY SCANNER ROOT RESILIENCE ROUTE ---
// Resolves Mozilla Observatory's 404 error by answering standard GET crawl probes with a clean 200 OK status
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'Online',
        message: 'Portfolio secure API infrastructure engine is actively running.'
    });
});

// --- SECURE MAIL TRANSMISSION ROUTE ---
// Targets endpoint action for frontend contact form submission handles
app.post('/api/contact', contactFormLimiter, async (req, res) => {
    // Unpack 'nickname' used for the invisible spambot honeypot trap
    const { name, email, message, nickname } = req.body;

    // --- 🚀 SECURITY LAYER 3: THE HONEYPOT TRAP ---
    if (nickname) {
        console.warn(`🤖 BOT TRAPPED: Silently dropped automated spam submission.`);
        // Fool the automated script with a fake 200 success code so it abandons the loop
        return res.status(200).json({ success: 'Message dispatched securely!' });
    }

    // 1. Initial manual payload structure data validation checkpoints
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are strictly required.' });
    }

    if (name.trim().length < 4 || name.length > 25) {
        return res.status(400).json({ error: 'Name must be between 4 and 25 characters long.' });
    }

    if (message.trim().length < 10) {
        return res.status(400).json({ error: 'Please enter a more descriptive message (minimum 10 characters).' });
    }

    const fallbackRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    try {
        // 2. Outsource validation parameters to Abstract API over secure HTTPS
        const verificationUrl = `https://abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`;
        const verificationResponse = await axios.get(verificationUrl);

        const { is_valid_format, is_disposable_email, deliverability } = verificationResponse.data;

        if (is_valid_format === false) {
            return res.status(400).json({ error: 'Please enter a valid email address format structure.' });
        }

        if (is_disposable_email === true) {
            return res.status(400).json({ error: 'Disposable or temporary email generators are fully blocked.' });
        }

        if (deliverability === 'UNDELIVERABLE') {
            return res.status(400).json({ error: 'This email account does not exist. Please enter a real email.' });
        }

    } catch (apiErr) {
        console.warn('Abstract API threshold reached. Executing regex backup validation layer:', apiErr.message);
        if (!fallbackRegex.test(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address format structure.' });
        }
    }

    const viewerIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // 3. Dispatch confirmed verified payload parameters directly to your inbox via Resend
        const { data, error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: process.env.EMAIL_USER,
            replyTo: email,
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
    console.log(`Portfolio API engine operating smoothly on port ${PORT} with Resend & Security Shields`);
});
