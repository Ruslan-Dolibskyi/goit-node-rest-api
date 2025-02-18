import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';
import { listContacts, getContactById, removeContact, addContact, updateContact as updateContactService } from '../services/contactsServices.js';
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
            throw HttpError(404, 'Not found');
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await removeContact(id);
        if (!contact) {
            throw HttpError(404, 'Not found');
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

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (Object.keys(req.body).length === 0) {
            throw HttpError(400, 'Body must have at least one field');
        }

        const { error } = updateContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }

        const updatedContact = await updateContactService(id, req.body);
        if (!updatedContact) {
            throw HttpError(404, 'Not found');
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};
