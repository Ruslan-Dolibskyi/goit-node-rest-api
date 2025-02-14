import fs from "fs/promises";
import path from "path";

// Отримання __dirname у ES модулях
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Шлях до файла contacts.json
const contactsPath = path.join(__dirname, "db", "contacts.json");

// Асинхронна функція для отримання списку всіх контактів
async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}

// Асинхронна функція для отримання контакту за ID
async function getContactById(contactId) {
    try {
        const contacts = await listContacts();
        return contacts.find((contact) => contact.id === contactId) || null;
    } catch (error) {
        console.error("Error getting contact:", error);
        return null;
    }
}

// Асинхронна функція для додавання нового контакту
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

// Асинхронна функція для видалення контакту
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

export { listContacts, getContactById, addContact, removeContact };