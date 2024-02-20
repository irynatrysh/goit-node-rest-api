import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

const contactsPath = join(__dirname, "..", "db", "contacts.json");

async function listContacts() {
  return JSON.parse(await readFile(contactsPath, "utf-8"));
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const removedContact = contacts.find((contact) => contact.id === contactId);
  if (removedContact) {
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return removedContact;
  } else {
    return null;
  }
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
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateContact(contactId, body) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    const updatedContact = { ...contacts[index], ...body };
    contacts[index] = updatedContact;
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact;
  } else {
    return null;
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
