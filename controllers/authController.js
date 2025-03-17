import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import User from "../db/models/user.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import { sendVerificationEmail } from "../services/emailService.js";

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key";
const avatarsDir = path.resolve("public/avatars");

export const registerUser = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email in use" });
        }

        const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = nanoid();

        console.log(`🔹 Генерований токен верифікації: ${verificationToken}`);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL,
            verificationToken,
            verify: false,
        });

        await sendVerificationEmail(email, verificationToken);

        console.log(`✅ Користувач ${email} успішно зареєстрований. Токен: ${verificationToken}`);

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
            },
            message: "Verification email sent",
        });
    } catch (err) {
        console.error("❌ Помилка реєстрації:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }

        if (!user.verify) {
            return res.status(401).json({ message: "Email not verified. Please verify your email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "24h" });
        user.token = token;
        await user.save();

        res.status(200).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
                avatarURL: user.avatarURL,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const user = req.user;
        user.token = null;
        await user.save();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const { email, subscription, avatarURL } = req.user;
        res.status(200).json({ email, subscription, avatarURL });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Будь ласка, завантажте файл" });
        }

        const { path: tempPath, filename } = req.file;
        const newFileName = `${req.user.id}${path.extname(filename)}`;
        const newPath = path.join(avatarsDir, newFileName);

        await fs.rename(tempPath, newPath);

        const avatarURL = `/avatars/${newFileName}`;
        req.user.avatarURL = avatarURL;
        await req.user.save();

        res.status(200).json({ avatarURL });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ where: { verificationToken } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.verify = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: "Verification successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Missing required field email" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verify) {
            return res.status(400).json({ message: "Verification has already been passed" });
        }

        await sendVerificationEmail(user.email, user.verificationToken);

        console.log(`✅ Повторно відправлено лист на email: ${email}`);

        res.status(200).json({ message: "Verification email sent" });
    } catch (err) {
        console.error("❌ Помилка при повторному надсиланні email:", err);
        res.status(500).json({ message: "Server error" });
    }
};
