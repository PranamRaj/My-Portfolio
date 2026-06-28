const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config(); // Secures sensitive credentials via .env file

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE CONFIGURATION ---
// 🚀 PRODUCTION FIX: Dynamic CORS array to allow both local testing and your live website
const allowedOrigins = [
    'http://localhost:5173',               // Local Vite Development environment
    process.env.FRONTEND_URL              // Your live production website domain (e.g., from Vercel/Firebase)
].filter(Boolean);                         // Removes undefined/empty environment values safely

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, postman, or local testing tools)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Cross-Origin Request Blocked by Security Policies.'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 // Handles older browsers (IE11) choking on 204 options responses
}));

app.use(express.json()); // Parses incoming json bodies safely

// --- MAIL CONFIGURATION CONFIG ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // 🚀 THE CURE: Forces the underlying socket engine to pick IPv4 (A records) over IPv6 (AAAA records)
    lookup: (hostname, options, callback) => {
        options.family = 4; // Force IPv4 routing explicitly
        return dns.lookup(hostname, options, callback);
    }
});


// --- SECURE MAIL TRANSMISSION ROUTE ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Basic data hygiene validation checkpoint
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are strictly required.' });
    }

    // HTML Email layout customized for portfolio receipts
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Sends directly to your inbox
        replyTo: email, // Direct replies inside your mail client map to the sender
        subject: `New Portfolio Message from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f7; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <h2 style="color: #3b82f6; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top:0;">Portfolio Transmission Received</h2>
                    <p style="margin: 15px 0;"><strong>Sender Name:</strong> ${name}</p>
                    <p style="margin: 15px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; font-style: italic;">
                        "${message.replace(/\n/g, '<br>')}"
                    </div>
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                        Sent securely from your portfolio ingestion backend.
                    </p>
                </div>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: 'Message dispatched securely!' });
    } catch (error) {
        console.error('Nodemailer pipeline error:', error);
        return res.status(500).json({ error: 'Failed to dispatch message. Pipeline error.' });
    }
});

// Start listening engine
app.listen(PORT, () => {
    console.log(`Portfolio server engine active on port ${PORT}`);
});
