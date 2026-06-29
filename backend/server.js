const express = require('express');
const { Resend } = require('resend'); // 🚀 SECURE HTTPS EMAIL API
const cors = require('cors');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);

const PORT = process.env.PORT || 5000;

// --- RESEND CONFIGURATION ---
// Initializes Resend with your secure environment variable API key
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
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are strictly required.' });
    }

    // 🚀 THE FIX: Read the forwarded IP address header from Render, or fallback to connection info
    const viewerIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
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
                        <!-- 🚀 IP DISPLAY ACCENT: Appends the network origin straight into your email -->
                        <p style="margin: 15px 0;"><strong>Viewer IP Address:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${viewerIP}</span></p>
                        <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; font-style: italic;">
                            "${message.replace(/\n/g, '<br>')}"
                        </div>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                            Sent securely from your portfolio ingestion Resend HTTPS API.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Resend Internal API Error:', error);
            return res.status(500).json({ error: 'Failed to dispatch message.' });
        }

        return res.status(200).json({ success: 'Message dispatched securely!' });
    } catch (err) {
        console.error('Resend Pipeline Error:', err);
        return res.status(500).json({ error: 'Network error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Portfolio API engine actively operating on port ${PORT} with Resend`);
});
