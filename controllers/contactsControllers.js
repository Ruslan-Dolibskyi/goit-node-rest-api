import { createContactSchema, updateContactSchema, updateFavoriteSchema } from '../schemas/contactsSchemas.js';
import {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact as updateContactService,
    updateStatusContact
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts(req.user.id);
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await getContactById(id, req.user.id);
        res.status(200).json(contact);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { error } = createContactSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const owner = req.user.id;
        const newContact = await addContact({ ...req.body, owner });

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await removeContact(id, req.user.id);
        res.status(200).json(contact);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateContactHandler = async (req, res, next) => {
    try {
        const { error } = updateContactSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const { id } = req.params;
        const contact = await updateContactService(id, req.body, req.user.id);
        res.status(200).json(contact);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateContactFavorite = async (req, res, next) => {
    try {
        const { error } = updateFavoriteSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const { contactId } = req.params;
        const { favorite } = req.body;

        const updatedContact = await updateStatusContact(contactId, { favorite }, req.user.id);
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
