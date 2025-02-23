import { Contact } from "../db/models/contact.js";

export async function listContacts() {
    try {
        return await Contact.findAll();
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return null;
    }
}

export async function getContactById(contactId) {
    try {
        return await Contact.findByPk(contactId);
    } catch (error) {
        console.error("Error fetching contact by ID:", error);
        return null;
    }
}

export async function addContact({ name, email, phone, favorite = false }) {
    try {
        return await Contact.create({ name, email, phone, favorite });
    } catch (error) {
        console.error("Error adding contact:", error);
        return null;
    }
}

export async function removeContact(contactId) {
    try {
        const contact = await Contact.findByPk(contactId);
        if (!contact) return null;
        await contact.destroy();
        return contact;
    } catch (error) {
        console.error("Error removing contact:", error);
        return null;
    }
}

export async function updateContact(contactId, updatedData) {
    try {
        const contact = await Contact.findByPk(contactId);
        if (!contact) return null;
        await contact.update(updatedData);
        return contact;
    } catch (error) {
        console.error("Error updating contact:", error);
        return null;
    }
}

export async function updateStatusContact(contactId, { favorite }) {
    try {
        const contact = await Contact.findByPk(contactId);
        if (!contact) return null;
        await contact.update({ favorite });
        return contact;
    } catch (error) {
        console.error("Error updating contact status:", error);
        return null;
    }
}
