import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';
import { listContacts, getContactById, removeContact, addContact, updateContact as updateContactService } from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import asyncHandler from 'express-async-handler';

export const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await listContacts();
    res.status(200).json(contacts);
});

export const getOneContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json(contact);
});

export const deleteContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contact = await removeContact(id);
    if (!contact) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json(contact);
});

export const createContact = asyncHandler(async (req, res) => {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message);
    }

    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
});

export const updateContact = asyncHandler(async (req, res) => {
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
});
