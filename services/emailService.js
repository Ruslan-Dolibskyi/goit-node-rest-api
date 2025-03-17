import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import dotenv from "dotenv";

dotenv.config();

const mailgunAuth = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    },
};

const transporter = nodemailer.createTransport(mg(mailgunAuth));

export const sendVerificationEmail = async (email, verificationToken) => {
    const verificationLink = `http://localhost:3000/api/auth/verify/${verificationToken}`;

    const mailOptions = {
        from: process.env.MAILGUN_FROM_EMAIL,
        to: email,
        subject: "Email Verification",
        text: `Please verify your email by clicking the link: ${verificationLink}`,
        html: `<p>Please verify your email by clicking the link: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending verification email:", error.message);
    }
};
