import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';
import {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact as updateContactService,
    updateStatusContact
} from "../services/contactsServices.js";
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await getContactById(id);
        if (!contact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { error } = createContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const newContact = await addContact(req.body);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await removeContact(id);
        if (!contact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const updateContactHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await updateContactService(id, req.body);
        if (!contact) {
            return res.status(404).json({ message: "Not found" });
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};


export const updateContactFavorite = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { favorite } = req.body;

        if (typeof favorite !== 'boolean') {
            return res.status(400).json({ message: 'Missing field favorite' });
        }

        const updatedContact = await updateStatusContact(contactId, { favorite });

        if (!updatedContact) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};
