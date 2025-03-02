import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContactHandler,
    updateContactFavorite
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, getAllContacts);
contactsRouter.get("/:id", authMiddleware, getOneContact);
contactsRouter.delete("/:id", authMiddleware, deleteContact);
contactsRouter.post("/", authMiddleware, createContact);
contactsRouter.put("/:id", authMiddleware, updateContactHandler);
contactsRouter.patch("/:contactId/favorite", authMiddleware, updateContactFavorite);

export default contactsRouter;
