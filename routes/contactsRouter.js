import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";

const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} = contactsControllers;

import { middlewares } from "../api/index.js";
import { schemas } from "../models/contactModel.js";


const contactsRouter = express.Router();


contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", middlewares.isValidId, getOneContact);

contactsRouter.delete("/:id", middlewares.isValidId, deleteContact);

contactsRouter.post("/", middlewares.validateBody(schemas.createContactSchema), createContact);

contactsRouter.patch("/:id/favorite", middlewares.isValidId, middlewares.validateBody(schemas.updateFavoriteSchema), updateFavorite);

contactsRouter.put("/:id", middlewares.isValidId, middlewares.validateBody(schemas.updateContactSchema), updateContact);

export default contactsRouter;
