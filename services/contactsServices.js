import { Contact } from "../db/models/contact.js";

export async function listContacts() {
    try {
        return await Contact.findAll();
    } catch (error) {
        throw new Error("Помилка при отриманні списку контактів");
    }
}

export async function getContactById(contactId) {
    try {
        const contact = await Contact.findByPk(contactId);
        if (!contact) throw new Error("Контакт не знайдено");
        return contact;
    } catch (error) {
        throw error;
    }
}

export async function addContact({ name, email, phone, favorite = false, owner }) {
    try {
        return await Contact.create({ name, email, phone, favorite, owner });
    } catch (error) {
        throw new Error("Помилка при створенні контакту");
    }
}

export async function removeContact(contactId) {
    try {
        const contact = await Contact.findByPk(contactId);
        if (!contact) throw new Error("Контакт не знайдено");
        await contact.destroy();
        return contact;
    } catch (error) {
        throw new Error("Помилка при видаленні контакту");
    }
}

export async function updateContact(contactId, updatedData) {
    try {
        const contact = await Contact.findByPk(contactId);
        if (!contact) throw new Error("Контакт не знайдено");
        await contact.update(updatedData);
        return contact;
    } catch (error) {
        throw new Error("Помилка при оновленні контакту");
    }
}

export async function updateStatusContact(contactId, { favorite }) {
    try {
        const contact = await Contact.findByPk(contactId);
        if (!contact) throw new Error("Контакт не знайдено");
        await contact.update({ favorite });
        return contact;
    } catch (error) {
        throw new Error("Помилка при оновленні статусу контакту");
    }
}
