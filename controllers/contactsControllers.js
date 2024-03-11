import { Contact } from "../models/contact.js";
import wrapper from "../helpers/wrap.js";
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const query = { owner };

  if (favorite !== undefined) {
    query.favorite = favorite === "true";
  }

  const resultAllContacts = await Contact.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  res.json(resultAllContacts);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const resultContactById = await Contact.findOne(
    { _id: id, owner },
    "-createdAt -updatedAt"
  );

  if (!resultContactById) {
    throw HttpError(404, "Not found");
  }
  res.json(resultContactById);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;

  const resultNewContact = await Contact.create({ ...req.body, owner });

  res.status(201).json(resultNewContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const resultUpdate = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  })
    .where("owner")
    .equals(owner);

  if (!resultUpdate) {
    throw HttpError(404, "Not found");
  }
  res.json(resultUpdate);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const resultFavorite = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  })
    .where("owner")
    .equals(owner);

  if (!resultFavorite) {
    throw HttpError(404, "Not found");
  }
  res.json(resultFavorite);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const resultDelete = await Contact.findByIdAndDelete(id)
    .where("owner")
    .equals(owner);

  if (!resultDelete) {
    throw HttpError(404, "Not found");
  }
  res.json(resultDelete);
};

export default {
  getAllContacts: wrapper(getAllContacts),
  getOneContact: wrapper(getOneContact),
  createContact: wrapper(createContact),
  updateContact: wrapper(updateContact),
  updateFavorite: wrapper(updateFavorite),
  deleteContact: wrapper(deleteContact),
};
