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

// --- SECURE MAIL TRANSMISSION ROUTE ---
// --- SECURE MAIL TRANSMISSION ROUTE ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // 1. Initial sanitization empty payload check
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are strictly required.' });
    }

    try {
        // 2. Outsource validation payload to Abstract API over secure HTTPS
        const verificationUrl = `https://abstractapi.com{process.env.ABSTRACT_API_KEY}&email=${email}`;
        const verificationResponse = await axios.get(verificationUrl);

        // 🚀 THE FINAL PRODUCTION CURE: Abstract API nests the actual boolean evaluation flags 
        // inside child objects called `.value`. We extract the parent objects here safely.
        const { is_valid_format, is_disposable_email, deliverability } = verificationResponse.data;

        // Validation Check A: Verify basic string layout formatting syntax (.value returns true/false)
        if (!is_valid_format || is_valid_format.value === false) {
            return res.status(400).json({ error: 'Please enter a valid email address format structure.' });
        }

        // Validation Check B: Block automated throwaway temp-mail generators (.value returns true/false)
        if (is_disposable_email && is_disposable_email.value === true) {
            return res.status(400).json({ error: 'Disposable or temporary email generators are fully blocked.' });
        }

        // Validation Check C: REAL EXISTENCE CHECK (Free Tier Safe Check)
        // Since free keys default to "UNKNOWN", we only block if the status is explicitly "UNDELIVERABLE"
        if (deliverability === 'UNDELIVERABLE') {
            return res.status(400).json({ error: 'This email account does not exist. Please enter a real email.' });
        }

        // 3. Capture visitor IP address safely after verification passes successfully
        const viewerIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

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
                            Sent securely from your portfolio ingestion Resend HTTPS API with Abstract verification.
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
        console.error('Core backend pipeline crash details:', err.message);
        return res.status(500).json({ error: 'Internal server error processing transmission validation.' });
    }
});


app.listen(PORT, () => {
    console.log(`Portfolio API engine actively operating on port ${PORT} with Resend & Abstract API`);
});
