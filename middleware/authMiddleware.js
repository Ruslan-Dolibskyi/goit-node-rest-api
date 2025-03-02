import jwt from "jsonwebtoken";
import User from "../db/models/user.js";

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key";

const authMiddleware = async (req, res, next) => {
    try {
        const { authorization = "" } = req.headers;
        const [bearer, token] = authorization.split(" ");

        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findByPk(id);

        if (!user || user.token !== token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Not authorized" });
    }
};

export default authMiddleware;
