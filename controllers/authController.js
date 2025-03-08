import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import User from "../db/models/user.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

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

        const newUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL,
        });

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
            },
        });
    } catch (err) {
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

        res.status(200).json({
            email,
            subscription,
            avatarURL,
        });
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
