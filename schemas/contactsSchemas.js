import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[0-9\- ]+$/).required(),
    favorite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+?[0-9\- ]+$/),
    favorite: Joi.boolean(),
}).min(1);

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});
