import fs from "fs/promises";
import path from "path";

const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}

async function getContactById(contactId) {
    try {
        const contacts = await listContacts();
        return contacts.find((contact) => contact.id === contactId) || null;
    } catch (error) {
        console.error("Error getting contact:", error);
        return null;
    }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await listContacts();
        const newContact = {
            id: Date.now().toString(),
            name,
            email,
            phone,
        };
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact;
    } catch (error) {
        console.error("Error adding contact:", error);
        return null;
    }
}

async function removeContact(contactId) {
    try {
        const contacts = await listContacts();
        const index = contacts.findIndex((contact) => contact.id === contactId);
        if (index === -1) return null;
        const [removedContact] = contacts.splice(index, 1);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return removedContact;
    } catch (error) {
        console.error("Error removing contact:", error);
        return null;
    }
}

async function updateContact(id, updatedFields) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);

    if (index === -1) {
        return null;
    }

    contacts[index] = { ...contacts[index], ...updatedFields };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return contacts[index];
}

export { listContacts, getContactById, addContact, removeContact, updateContact };