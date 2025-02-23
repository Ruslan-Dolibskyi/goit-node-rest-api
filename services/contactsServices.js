import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId) || null;
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {
        id: uuidv4(),
        name,
        email,
        phone,
    };

    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return newContact;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index === -1) {
        throw new Error(`Contact with ID ${contactId} not found`);
    }

    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return removedContact;
}

async function updateContact(id, updatedFields) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);

    if (index === -1) {
        throw new Error(`Contact with ID ${id} not found`);
    }

    contacts[index] = { ...contacts[index], ...updatedFields };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return contacts[index];
}

export { listContacts, getContactById, addContact, removeContact, updateContact };
