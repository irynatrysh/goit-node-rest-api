import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContacts,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { error } from "console";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getContactById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeContact(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
    try {
      const { name, email, phone} = req.body
      const result = await addContact({ name, email, phone });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  export const updateContact = async (req, res, next) => {
    try {
      if (Object.keys(req.body).length === 0) {
        throw HttpError(400, "Body must have at least one field");
      }
      const { id } = req.params;
      const result = await updateContacts(id, req.body);
  
      if (!result) {
        throw HttpError(404);
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  };