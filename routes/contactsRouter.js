import express from "express";
import contactsControllers from '../controllers/contactsControllers.js'
import { authorization, validateID, validateBody } from "../controllers/index.js";
import { schemas } from "../models/contact.js";

const {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  updateFavorite,
  deleteContact
} = contactsControllers

const contactsRouter = express.Router();

contactsRouter.get("/", authorization, getAllContacts);

contactsRouter.get("/:id", authorization, validateID, getOneContact);

contactsRouter.delete("/:id", authorization, validateID, deleteContact);

contactsRouter.post("/", authorization, validateBody(schemas.createContactSchema), createContact);

contactsRouter.patch("/:id/favorite", authorization, validateID, validateBody(schemas.updateFavoriteSchema), updateFavorite);

contactsRouter.put("/:id", authorization, validateID, validateBody(schemas.updateContactSchema), updateContact);

export default contactsRouter;